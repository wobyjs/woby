# Server-Side Rendering (SSR)

Woby renders to a string without a browser, a DOM implementation, or JSDOM. The package
ships its own minimal node tree (`woby/ssr`) that `renderToString` builds into, so the same
components that run in the browser also run in Node, Deno, Bun, or a worker.

> **Scope.** This is *string rendering*, not hydration. There is no `hydrate()`, no server
> components, and no streaming. `renderToString` produces markup; the client renders
> normally with `render()`.

---

## Table of Contents

- [renderToString](#rendertostring)
- [createDocument](#createdocument)
- [The SSR node tree](#the-ssr-node-tree)
- [Traversal API](#traversal-api)
- [Mutation API](#mutation-api)
- [The CSS selector engine](#the-css-selector-engine)
- [Document queries](#document-queries)
- [ownerDocument stamping](#ownerdocument-stamping)
- [Custom elements under SSR](#custom-elements-under-ssr)
- [Environment detection](#environment-detection)
- [Known gaps](#known-gaps)

---

## `renderToString`

Renders a component or JSX element to an HTML string. **Synchronous** — it returns a
`string`, not a `Promise`.

```ts
interface RenderToStringOptions {
    /** Render into an existing SSR document instead of a fresh one. */
    document?: SSRDocument
    /** Return `{ html, document }` so you can inspect what landed in `document.body`. */
    returnDocument?: boolean
    /** Append to existing content instead of replacing it. */
    append?: boolean
}

function renderToString<T extends RenderToStringOptions = RenderToStringOptions>(
    child: Child,
    options?: T
): T extends { returnDocument: true } ? { html: string; document: SSRDocument } : string
```

```tsx
import { renderToString } from 'woby'

const App = () => <p>Hello, World!</p>

const html = renderToString(<App />)
// '<p>Hello, World!</p>'
```

### Inspecting the document a render produced

Portals and anything else that writes to `document.body` do not appear in the returned
markup. Pass `returnDocument: true` to get the document back and query it:

```tsx
const { html, document: doc } = renderToString(<App />, { returnDocument: true })

doc.querySelector('.toast')       // the portalled node
doc.body.querySelectorAll('div')  // plain array
```

### Isolated documents

Each `renderToString` call creates its own document unless you supply one, so parallel
renders never share state:

```tsx
import { createDocument, renderToString } from 'woby'

const doc = createDocument()
renderToString(<Header />, { document: doc })
renderToString(<Body />, { document: doc, append: true })
```

---

## `createDocument`

```ts
const createDocument: () => SSRDocument
```

Builds a fresh, isolated document with its own `head` and `body`. Two documents share
nothing — a node created by one is never found by the other.

```ts
import { createDocument } from 'woby'

const doc = createDocument()
const p = doc.createElement('p')
doc.body.appendChild(p)

doc.querySelector('p')       // p
createDocument().contains(p) // false
```

A default singleton `document` is also exported from `woby/ssr` for simple cases, but prefer
`createDocument()` anywhere isolation matters (tests, concurrent requests).

---

## The SSR node tree

Everything is reachable through the `ssr` namespace export:

```ts
import { ssr } from 'woby'

ssr.createElement('div')          // Element
ssr.createElementNS(ns, 'svg')    // SVGNode
ssr.createText('hi')              // text node
ssr.createComment('c')            // Comment
ssr.createDocumentFragment()      // DocumentFragmentNode
```

| class | `nodeType` | notes |
|---|---|---|
| `Element` | `1` | `tagName` is upper-cased; attributes live in a plain `attributes` object |
| text node | `3` | `textContent` |
| `Comment` | `8` | |
| `DocumentFragmentNode` | `11` | |

The document object itself deliberately has **no** `nodeType` — see [Known gaps](#known-gaps).

### Element specifics

```ts
const el = ssr.createElement('div')

el.tagName                    // 'DIV'  (always upper-case)
el.setAttribute('data-n', 1)  // values are coerced with String(value)
el.getAttribute('data-n')     // '1'
el.hasAttribute('data-n')     // true
el.removeAttribute('class')   // also clears .className

el.className = 'a b'          // kept in sync with attributes['class']
el.classList.toggle('a')      // supports the force argument
el.htmlFor = 'x'              // serialises as for="x"
el.id = 'x'                   // getter and setter

el.outerHTML                  // attribute names lower-cased, void elements self-closed
el.innerHTML                  // getter composes real markup
el.cloneNode(true)            // shallow and deep both supported
```

---

## Traversal API

Added to `BaseNode`, so every SSR node has them.

| member | behaviour |
|---|---|
| `children` | `childNodes` filtered to `nodeType === 1` |
| `firstElementChild` | first element child, else `null` |
| `lastElementChild` | last element child, else `null` |
| `nextElementSibling` | next sibling with `nodeType === 1` — skips text and comments |
| `previousElementSibling` | previous sibling with `nodeType === 1` |
| `parentElement` | `null` unless the parent is an element; a fragment or document parent yields `null` |
| `getRootNode()` | the topmost node of the tree, **not** `ownerDocument` |
| `contains(other)` | walks `other`'s ancestors, self included |
| `hasChildNodes()` | counts non-element children too |
| `isSameNode` / `isEqualNode` | reference identity / structural equality |

```ts
const root = ssr.createElement('div')
root.appendChild(ssr.createText('   '))
root.appendChild(ssr.createElement('p'))

root.children.length          // 1
root.firstChild.nodeType      // 3 — the text node
root.firstElementChild        // the <p>
```

---

## Mutation API

| member | behaviour |
|---|---|
| `appendChild(child)` | detaches `child` from its old parent first — one parent per node |
| `insertBefore(node, ref)` | detaches `node` **before** indexing `ref`; `ref = null` appends |
| `removeChild(child)` | returns the removed child |
| `remove()` | detaches from parent; a no-op when there is no parent |
| `replaceChild(new, old)` | returns `old` |
| `replaceWith(...nodes)` | accepts nodes and strings; no arguments removes the node |
| `append(...nodes)` | appends several nodes in order |
| `before(...nodes)` | inserts before the node |

Re-appending an existing child moves it to the end rather than duplicating it, and
`insertBefore` computes the target index *after* the detach, so moving a node within its own
parent lands on the right slot:

```ts
// root children: a, b, c
root.insertBefore(c, a)   // → c, a, b   (three children, not four)
```

Errors mirror the DOM:

| call | message |
|---|---|
| `insertBefore(n, notAChild)` | `Reference node not found` |
| `removeChild(notAChild)` | `Child node not found` |
| `replaceChild(n, notAChild)` | `Old child node not found` |

Every mutation is visible to the selector engine immediately — there is no cache to
invalidate.

---

## The CSS selector engine

`src/ssr/selector.ts`, exported from `woby/ssr` and reachable as `ssr.querySelector(root, sel)`.
`BaseNode` and `SSRDocument` expose it under the standard DOM names.

| export | signature | notes |
|---|---|---|
| `parseSelector` | `(sel: string) => Complex[]` | memoised; throws `SyntaxError` on bad input |
| `matchesSelector` | `(el, selector) => boolean` | `false` for non-elements, never throws on those |
| `closestSelector` | `(el, selector) => any \| null` | self first, then ancestors |
| `descendantElements` | `(root) => Generator<any>` | document order; **does not enter shadow trees** |
| `querySelectorAll` | `(root, selector) => any[]` | a **plain array**, not a `NodeList` |
| `querySelector` | `(root, selector) => any \| null` | first match in document order |
| `getElementById` | `(root, id) => any \| null` | exact `id` attribute match |

### Supported grammar

```
*                       universal
tag                     type — case-insensitive, non-ASCII tag names welcome
#id  .class             id / class
[a] [a=v] [a~=v]        attribute presence and value
[a|=v] [a^=v]
[a$=v] [a*=v]
div.a[b]                compound — order-independent
a b     a > b           descendant / child combinators
a, b                    selector list
```

Attribute values may be bare, `'single'` or `"double"` quoted, with backslash escapes inside
quotes. An empty `want` never matches for `~=`, `^=`, `$=` or `*=`; `|=` matches either the
exact value or the `want + '-'` prefix. The case-sensitivity flag (`[a=v i]`, `s`) is
**parsed and ignored**.

Identifiers accept `A-Z a-z 0-9 _ -` plus every code point from U+00A0 upward, so CJK tag
names such as `sy-四柱八字` parse as a single identifier.

Compound selectors are order-independent — `div.a[b]`, `.a[b]div` and `[b]div.a` select the
same set. Descendant steps backtrack across **every** ancestor, not just the nearest one, so
`a b > c` matches when a further-out `b` is the one under an `a`.

### It throws — on purpose

Anything unrecognised raises a `SyntaxError` rather than quietly matching nothing. A typo in
a selector should never read back as "no results".

| input | message fragment |
|---|---|
| `':hover'`, `'a:not(b)'` | `pseudo-classes are not supported` |
| `'a + b'`, `'a ~ b'` | `sibling combinators are not supported` |
| `'.'`, `'#'` | `empty class` / `empty id` |
| `'[]'`, `'[ ]'` | `empty attribute name` |
| `'[a!b]'` | `expected "=" in an attribute selector` |
| `'[a="x'` | `unterminated string` |
| `'[a=x'` | `expected "]"` |
| `''`, `'   '` | `empty selector` |
| `'%'`, `'@'` | `unexpected "%"` |

The full message reads
`'<sel>' is not a valid selector for the SSR selector engine (<why>, at offset <n>).`

Parsing is memoised by the raw string, and the cache is written **only after a successful
parse** — a bad selector throws every time, not just the first.

### Deliberately absent

Pseudo-classes and pseudo-elements, the sibling combinators (`+`, `~`), and namespaces
(`ns|tag`) — all throw. There is no `:scope`: a selector is always evaluated against the
**descendants** of the root, never the root itself. Use `matches()` for that.

### Node-level members

| member | behaviour |
|---|---|
| `matches(sel)` | delegates to `matchesSelector` |
| `closest(sel)` | delegates to `closestSelector` |
| `querySelector(sel)` | descendants only |
| `querySelectorAll(sel)` | returns a plain array |
| `getElementsByTagName(tag)` | `'*'` returns every descendant element; otherwise case-insensitive |
| `getElementsByClassName(names)` | space-separated, **all** must be present; empty or whitespace-only input returns `[]` |

`getElementsByClassName('a b')` matches `class="b a c"` — order-independent, supersets
allowed — and does not match `class="a"`.

---

## Document queries

`SSRDocument` gained four members:

```ts
querySelector: (selector: string) => any | null
querySelectorAll: (selector: string) => any[]
getElementById: (id: string) => any | null
contains: (node: any) => boolean
```

All four search **`head` then `body`, explicitly**. The document is a plain object rather
than a node with its own `childNodes`, so the consequences are worth knowing:

- `doc.querySelector` prefers a match in `head` over one in `body`.
- `doc.querySelectorAll` returns head matches **before** body matches — a concatenation, not
  a single document-order walk.
- `doc.getElementById` resolves a duplicated id to the `head` one.
- `doc.contains(doc.body)` is `true`; `doc.contains(doc)` and `doc.contains(detached)` are
  `false`.
- `doc.querySelector('body')` is `null` — the queries never return `body` or `head`
  themselves.

---

## `ownerDocument` stamping

All five document factories — `createComment`, `createElement`, `createElementNS` (both the
HTML and the SVG branch), `createTextNode`, `createDocumentFragment` — stamp the node they
return with `_ownerDocument`. `body` and `head` are stamped directly.

`ownerDocument` answers `_ownerDocument` when present, otherwise walks up the parents looking
for an inherited one. So:

```ts
const doc = createDocument()

const detached = doc.createElement('div')
detached.ownerDocument          // doc — even though it was never inserted

const bare = ssr.createElement('span')
bare.ownerDocument              // null — module-level factories belong to no document
doc.body.appendChild(bare)
bare.ownerDocument              // doc — inherited from the ancestor
bare._ownerDocument             // still null — the stamp is not copied down the tree
```

This is what lets code call `node.ownerDocument.createElement(...)` to build siblings before
inserting anything.

---

## Custom elements under SSR

`customElement(tag, Component)` picks its branch by feature detection:

```ts
if (globalThis.window && globalThis.document && typeof globalThis.HTMLElement === 'function') {
    createBrowserCustomElement(tagName, component)
} else {
    createSSRCustomElement(tagName, component)
}
```

The `typeof globalThis.HTMLElement === 'function'` clause matters: the browser branch's first
statement is `class extends HTMLElement`, so a `window` **without** `HTMLElement` is not a
browser and taking that branch is a guaranteed `ReferenceError`. Half-shimmed environments
are real — some Deno polyfills set `globalThis.window = globalThis` and define no DOM
constructors at all.

The SSR branch registers into woby's own registry as well, so "is this tag defined?" answers
on both sides:

```ts
import { customElement, ssr } from 'woby'

customElement('x-y', C)
ssr.customElements.get('x-y')   // defined
```

SSR custom elements take their props through the **constructor**. There is no upgrade path,
no `observedAttributes`, and `whenDefined` is a resolved no-op — `setAttribute` on a host does
not reach the component.

`renderToString` emits only the host tag for a custom element (e.g.
`<custom-element></custom-element>`), without shadow root or slot content.

---

## Environment detection

Two internals were made environment-safe, and both matter to anyone writing code that runs on
the server:

- **`isNode(value)`** is structural — `typeof value.nodeType === 'number'` — rather than
  `value instanceof Node`. `Node` is a browser global, so the `instanceof` form throws
  `ReferenceError` under SSR instead of answering `false`. The structural form also works
  across realms, which `instanceof` never did.
- **The diff path** resolves its node class as `globalThis.Node ?? BaseNode`. Before this,
  every reactive child (`{() => cond && <p/>}`) crashed on the same `ReferenceError` before
  it reached the diff.

---

## Known gaps

Each is a deliberate decision. Code against the current behaviour, not against the DOM.

| gap | why |
|---|---|
| **The document has no `nodeType: 9`** | `isConnected` looks for exactly that, and the context-ref, custom-element and stylesheet paths branch on `isConnected` to tell the constructor path from the `connectedCallback` path. Stamping the document as a node would silently flip every SSR render onto the other branch. `_ownerDocument` answers `ownerDocument` without touching it. Consequence: `isConnected` is `false` even for a node inside `doc.body`. |
| **`innerHTML` setter does not parse** | It stores one text node. The *getter* does compose real markup. Build trees node by node. |
| **No `DOMParser`, no `insertAdjacentHTML`** | Same reason — there is no HTML parser in the package. |
| **`querySelectorAll` returns an array** | `SimpleNodeList` has neither `forEach` nor numeric indexing. An array satisfies `.length`, `[i]`, `for…of`, `Array.from` and spread. `instanceof NodeList` will never pass. |
| **No shadow-tree traversal** | Matches the real DOM: a custom element's `shadowRoot` is outside its `childNodes`. |
| **No `window`** | SSR provides a document, not a browser. Consumers needing one install their own shim. |
| **No layout** | No `getComputedStyle`, no `getBoundingClientRect`, no `offsetWidth`. Anything measuring belongs in a real browser. |
| **No attribute-driven custom-element upgrade** | Props go through the constructor. |
| **`JSON.stringify` on any node throws** | `parentNode` makes every tree circular. Write a `describe`-style helper instead. |

---

## Testing against the SSR tree

The playground carries eleven specs covering this surface, each running identically in Node
(`pnpm test`) and in the browser:

| spec | covers |
|---|---|
| `TestSsrElement` | attributes, `className`/`classList`, `innerHTML`/`outerHTML`, `cloneNode` |
| `TestSsrCustomElement` | the `HTMLElement` guard and the SSR registry |
| `TestSsrReactiveChild` | `isNode`, reactive children through `renderToString` |
| `TestSsrIdentity` | `contains`, `getRootNode`, `ownerDocument` stamping |
| `TestSsrMutation` | single-parent invariant, `insertBefore` indexing, `replaceWith` |
| `TestSsrSelectorMatch` | every attribute operator, quoting, `matches`/`closest` |
| `TestSsrSelectorQuery` | `descendantElements`, `getElementsBy*`, scoped queries |
| `TestSsrDocumentQuery` | head-then-body ordering, `getElementById`, `contains` |
| `TestSsrSelectorParse` | combinators, backtracking, selector lists, memoisation |
| `TestSsrTraversal` | element traversal getters |
| `TestSsrSelectorThrows` | every row of the throw table |

---

## See also

- [Core Methods](./Core-Methods.md) — `render`, `renderToString`, `resolve`
- [Custom Elements](./CUSTOM_ELEMENTS.md) — the browser branch
- [Built-in Components](./Built-in-Components.md) — `Portal` and friends under SSR
