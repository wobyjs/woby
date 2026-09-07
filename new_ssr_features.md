# New SSR features — handoff for test authoring

**Package:** `woby` 2.0.166
**Change set:** 7 files modified, 1 new (`src/ssr/selector.ts`), +192 / −18 plus 275 new lines
**Status:** implemented, `dist/` rebuilt with `npx vite build`, **types not yet re-emitted**, **no specs written**
**Purpose of this file:** everything you need to add, create and run new test specs covering the work.

---

## 0. Why any of this exists

woby's SSR nodes were built to **emit** HTML: attributes in, `outerHTML` out. Nothing
could read the tree back — no `querySelector`, no `matches`, no `closest`, no
`children`. That is fine for rendering a page and useless for testing one, because a
test's whole job is to inspect what it just built.

The su-yen monorepo removed jsdom from every suite and put woby's SSR document in its
place. That sweep is what surfaced the gaps below: some genuinely missing API, some
outright bugs that had never been exercised because nobody had ever read an SSR tree
back, and two `instanceof Node` ReferenceErrors that crashed rendering itself.

Everything here is **additive**. No existing SSR behaviour changed shape; the four
behaviour *fixes* (§3) each replaced a wrong answer with the DOM's answer.

---

## 1. New file: `src/ssr/selector.ts` (275 lines)

A CSS selector engine over the SSR node tree. Exported from `src/ssr/index.ts`
(`export * from './selector'`), so it is reachable as `ssr.querySelector(root, sel)` etc.
as well as through the node methods in §2.

### 1.1 Public API

| export | signature | notes |
|---|---|---|
| `parseSelector` | `(sel: string) => Complex[]` | memoised in a module-level `Map`; throws `SyntaxError` on bad input |
| `matchesSelector` | `(el, selector) => boolean` | false for non-elements, never throws on those |
| `closestSelector` | `(el, selector) => any \| null` | self first, then ancestors |
| `descendantElements` | `(root) => Generator<any>` | document order; **does not enter shadow trees** |
| `querySelectorAll` | `(root, selector) => any[]` | **plain array**, not a `NodeList` |
| `querySelector` | `(root, selector) => any \| null` | first match in document order |
| `getElementById` | `(root, id) => any \| null` | exact `id` attribute match |

### 1.2 Supported grammar

```
*                       universal
tag                     type (case-insensitive; non-ASCII tag names welcome)
#id  .class             id / class
[a] [a=v] [a~=v]        attribute presence and value, values quoted or bare
[a|=v] [a^=v]
[a$=v] [a*=v]
div.a[b]                compound
a b     a > b           descendant / child combinators
a, b                    selector list
```

Attribute operators, all implemented in `matchSimple`:

| op | semantics | edge case worth a spec |
|---|---|---|
| (none) | attribute present | present-but-empty-string still matches |
| `=` | exact | `String(v) === want` — numeric attrs are stringified |
| `~=` | whitespace-list membership | **empty `want` never matches** |
| `\|=` | exact **or** `want + '-'` prefix | the `lang`-style operator; `[a\|=en]` matches `en` and `en-GB`, not `english` |
| `^=` | prefix | empty `want` never matches |
| `$=` | suffix | empty `want` never matches |
| `*=` | substring | empty `want` never matches |

Quoting: values may be bare, `'single'` or `"double"` quoted. Inside quotes a backslash
escapes the next character. An unterminated string throws.

The case-sensitivity flag (`i`, `I`, `s`, `S`) after a value is **parsed and ignored** —
matching is always exact. That is a documented lie worth a spec so it does not silently
become truth later.

Tag matching is case-insensitive both ways (`el.tagName.toLowerCase() === s.v.toLowerCase()`),
and the ident charset is `/[A-Za-z0-9_\u00A0-\uFFFF-]/`, i.e. CJK tag names like
`sy-四柱八字` and `sy-八字-ctx` parse as one ident.

### 1.3 What throws — this is a feature, not a gap

Anything unrecognised throws `SyntaxError` rather than quietly matching nothing. A typo
in a selector should not read back as "no results". Every one of these deserves a spec:

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

The message format is
`'<sel>' is not a valid selector for the SSR selector engine (<why>, at offset <n>).`
Assert on the fragment, not the whole string, unless you want the offsets pinned too.

### 1.4 Parser details that need their own cases

- **Descendant vs child.** Whitespace only becomes a descendant combinator once a real
  token follows it, and it must never downgrade an explicit `>` sitting between the two.
  So `a > b`, `a>b`, `a  >  b` must all parse identically, and `a b` must differ from
  both.
- **Backtracking.** `matchFrom` retries **every** ancestor for a descendant step rather
  than taking the nearest match. The case that proves it: `a b > c` where the nearest `b`
  ancestor is not under an `a` but a further one is.
- **Selector lists.** `a, b` — each complex selector is matched independently; a node
  matching both must appear once in `querySelectorAll`, not twice.
- **Memoisation.** `parseSelector` caches by the raw string. A spec that parses the same
  selector twice should get identical results; more usefully, a spec that throws on a bad
  selector twice must throw **both** times (the cache is only written after a successful
  parse — verify that).
- **Compound order-independence.** `div.a[b]`, `.a[b]div`, `[b]div.a` are the same set.

### 1.5 Deliberate omissions

Not implemented, on purpose: pseudo-classes and pseudo-elements, sibling combinators
(`+`, `~`), namespaces (`ns|tag`). All throw. Also absent: `:scope` semantics — a
selector is always evaluated against **descendants** of the root, never the root itself
(that is what `matches` is for).

---

## 2. New members

### 2.1 `BaseNode` (`src/ssr/base_node.ts`)

| member | kind | behaviour |
|---|---|---|
| `_ownerDocument` | field | stamped by `document.createElement` & friends; `null` on nodes from the bare module-level factories |
| `children` | getter | `childNodes` filtered to `nodeType === 1` |
| `firstElementChild` | getter | `children[0] ?? null` |
| `lastElementChild` | getter | last of `children`, else `null` |
| `nextElementSibling` | getter | next sibling with `nodeType === 1`, else `null` |
| `previousElementSibling` | getter | previous sibling with `nodeType === 1`, else `null` |
| `remove()` | method | detach from parent; **no-op when there is no parent**, exactly like the DOM |
| `matches(sel)` | method | delegates to `matchesSelector` |
| `closest(sel)` | method | delegates to `closestSelector` |
| `querySelector(sel)` | method | delegates; descendants only |
| `querySelectorAll(sel)` | method | delegates; returns a **plain array** |
| `getElementsByTagName(tag)` | method | `'*'` returns every descendant element; otherwise case-insensitive tag match |
| `getElementsByClassName(names)` | method | space-separated, **all** must be present; empty/whitespace-only input returns `[]` |

Specs worth writing for the edges: `children` on a node holding only text/comment nodes
(`[]`); `nextElementSibling` skipping over two text nodes to reach an element;
`previousElementSibling` on a first child (`null`); `remove()` twice in a row (second is a
no-op, does not throw); `getElementsByClassName('a b')` against `class="b a c"` (matches —
order-independent, superset allowed) and against `class="a"` (no match).

### 2.2 `SSRDocument` (`src/ssr/document.ts`)

Four members added to the interface **and** the object:

```ts
querySelector: (selector: string) => any | null
querySelectorAll: (selector: string) => any[]
getElementById: (id: string) => any | null
contains: (node: any) => boolean
```

All four search **`head` then `body`, explicitly** — the document is a plain object, not a
node with a `childNodes` array, and giving it real child bookkeeping would put it in the
render path's way for no gain (nothing ever inserts a sibling of `<body>`). Consequences a
spec should pin:

- `doc.querySelector` finds a node in `head` in preference to one in `body` when both match.
- `doc.querySelectorAll` returns head matches **before** body matches — it is a
  concatenation, not a single document-order walk.
- `doc.contains(doc.body)` is **true** (`body.contains(body)` — self counts), and
  `doc.contains(detachedNode)` is false.

### 2.3 Ownership stamping — `归属`

`document.ts` wraps **all five** factories so every node the document hands out is stamped
with `_ownerDocument`:

`createComment`, `createElement`, `createElementNS` (both the SVG and the HTML branch),
`createTextNode`, `createDocumentFragment`.

`body` and `head` are stamped directly. `BaseNode.ownerDocument` then answers
`_ownerDocument` if present, else walks parents looking for `nodeType === 9` **or** an
inherited `_ownerDocument`.

Why it matters: code like su-yen's `整理外框` asks a **detached** node for its
`ownerDocument` so it can build siblings before inserting anything. Before this it got
`null` and threw. So the spec is: *a node created by the document but never inserted still
reports that document*, and *a child appended to such a node inherits it*.

Also spec the negative: a node built by the bare module-level factory (not via a document)
has `_ownerDocument === null` and reports whatever it inherits from an ancestor, else `null`.

---

## 3. Behaviour fixes — each row is a regression spec

Every one of these had a concrete, reproducible failure. Write the spec against the
failure, not against the fix.

| # | file | fix | the failure it replaced |
|---|---|---|---|
| 1 | `base_node.ts` `appendChild` | detach `child` from its old parent first | a moved node stayed listed under **both** parents, so a dragged block was still inside the frame it had just left |
| 2 | `base_node.ts` `insertBefore` | detach `newNode` first, **then** index the reference node | moving a node *within* its own parent computed the target index against the pre-removal `childNodes`, landing it one slot off |
| 3 | `base_node.ts` `contains` | walk `other`'s ancestors, self included | returned `false` unconditionally — `root.contains(anything)` was always false |
| 4 | `base_node.ts` `getRootNode` | walk to the topmost parent | returned `ownerDocument`, a different thing entirely once a node can have one while detached |
| 5 | `base_node.ts` `parentElement` | `null` unless the parent has `nodeType === 1` | returned `parentNode` verbatim, so a document/fragment parent came back as an "element" |
| 6 | `element.ts` `removeAttribute` | also clears the private `#className` for `class` / `className` | `getAttribute('class')` read `null` while `.className` still reported the old string |
| 7 | `element.ts` `replaceWith` | `parent.childNodes[i] ?? null` | the node had already removed itself, so replacing the **last** child indexed past the end; `insertBefore` treats `null` as append but **throws on `undefined`** |
| 8 | `custom_element.ts` `createSSRCustomElement` | also `wobyCustomElements.define(tagName, …)` | the SSR branch left woby's own registry empty, so "is this tag registered?" only answered on the browser branch. In SSR `_native` is null, so `define` touches only the private Map — no native side effects |
| 9 | `custom_element.ts` `customElement()` | require `typeof globalThis.HTMLElement === 'function'` as well as `window` + `document` | see §3.1 |
| 10 | `utils/diff.ts` | `const 节点类 = (globalThis.Node ?? BaseNode)` | `Node` is a browser global: `x instanceof Node` **throws `ReferenceError`** outside a browser rather than returning false, so every reactive child (`{() => cond && <p/>}`) crashed before reaching the diff |
| 11 | `utils/lang.ts` `isNode` | structural: `typeof value.nodeType === 'number'` | same `instanceof Node` ReferenceError; the structural form also works across realms, which `instanceof` never did |

### 3.1 The `HTMLElement` guard (#9) — the half-shimmed-window hazard

`customElement()` used to branch on `globalThis.window && globalThis.document`. The
browser branch's very first statement is `class extends HTMLElement`, so a `window`
without `HTMLElement` is **not a browser** and taking that branch is a guaranteed
`ReferenceError`.

Half-shims are real and they are upstream: `@woby/chk` bundles a Deno polyfill that runs
`globalThis.window = globalThis` and defines no DOM constructors at all. Any node test
that transitively imports it (anything reaching `@woby/wui`) used to crash on the **first**
`customElement()` call, before a single assertion ran.

Spec shape: with `globalThis.window` and `globalThis.document` set to non-DOM objects and
no `HTMLElement`, `customElement('x-y', C)` must take the SSR branch — i.e. not throw, and
`ssr.customElements.get('x-y')` must be defined.

### 3.2 Diff naming note (#10)

The fallback const is deliberately **not** named `Node`: shadowing the global would also
shadow the DOM `Node` *type*, and every `instanceof` below it would narrow to
`BaseNode | Node` and stop assigning to the `Node`-typed parameters it feeds. The cast
keeps the narrowing exactly what it was while the value stays environment-correct. If a
future refactor renames it, that is the regression to watch for — it is a **type** break,
so a `tsc` run is the test, not a runtime spec.

---

## 4. Known gaps — do not write specs expecting these to work

Each is a deliberate decision, not an oversight. A spec asserting the *current* behaviour
is fine and useful; a spec asserting DOM behaviour will fail.

| gap | why |
|---|---|
| **No `nodeType: 9` on the document** | `BaseNode.isConnected` looks for exactly that to decide a node is in a document, and `methods/context_ref.ts:148`, `methods/custom_element.ts:687` and `utils/stylesheets.ts:295` branch on `isConnected` to tell the constructor path from the `connectedCallback` path. Stamping the document as a node would silently flip **every** SSR render onto the other branch. `_ownerDocument` gives `ownerDocument` its answer without touching that. |
| **`innerHTML` setter does not parse** | it stores one text node. The *getter* does compose real markup. Build trees node by node. |
| **No `DOMParser`, no `insertAdjacentHTML`** | same reason — there is no HTML parser in the package. |
| **`querySelectorAll` returns an array** | `SimpleNodeList` has neither `forEach` nor numeric indexing, so it is the worse stand-in. An array satisfies `.length`, `[i]`, `for…of`, `Array.from` and spread. `instanceof NodeList` will never pass. |
| **No shadow-tree traversal** | matches the real DOM: a custom element's `shadowRoot` is outside its `childNodes` and `document.querySelector` cannot see into it. |
| **No `window`** | SSR provides a document, not a browser. Consumers that need one install their own shim — see §6.3. |
| **No layout** | no `getComputedStyle`, no `getBoundingClientRect`, no `offsetWidth`. Anything measuring belongs in Playwright. |
| **No attribute-driven custom-element upgrade** | SSR custom elements take props through the **constructor**. There is no upgrade, no `observedAttributes`, and `whenDefined` is a resolved no-op. `setAttribute` on a host does not reach the component. |
| **`JSON.stringify` on any node throws** | `parentNode` makes every tree circular. Write a `describe`-style helper instead. |

---

## 5. Suggested spec layout

A shape that maps one-to-one onto the sections above:

```
src/ssr/__tests__/          (or wherever §6 lands)
  selector.parse.test.ts       §1.2 grammar, §1.4 parser details
  selector.throws.test.ts      §1.3 — one case per row
  selector.match.test.ts       §1.2 attribute operator table
  selector.query.test.ts       querySelector / All / getElementById / descendantElements
  base_node.traversal.test.ts  §2.1 getters
  base_node.mutation.test.ts   §3 rows 1, 2, and remove()
  base_node.identity.test.ts   §3 rows 3, 4, 5 + §2.3 ownership
  document.test.ts             §2.2 + §2.3 stamping across all five factories
  element.test.ts              §3 rows 6, 7
  custom_element.ssr.test.ts   §3 rows 8, 9
  lang.diff.test.ts            §3 rows 10, 11 — assert no ReferenceError under node
```

Row 10's real proof is an end-to-end one: `renderToString(<div>{() => cond && <p/>}</div>)`
under plain node. Before the fix that threw `ReferenceError: Node is not defined`; a
reactive-child render test is therefore the highest-value single spec in the whole set.

### 5.1 Fixture helper

Because `innerHTML` does not parse, every spec builds its tree by hand. Something like:

```ts
import { ssr } from 'woby'

const 建 = (doc: any, tag: string, attrs: Record<string, string> = {}, ...kids: any[]) => {
    const el = doc.createElement(tag)
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v)
    for (const k of kids) el.appendChild(k)
    return el
}

const 新文档 = () => {
    const doc: any = ssr.createDocument()
    const root: any = doc.createElement('div')
    doc.body.appendChild(root)
    return { doc, root }
}
```

`ssr.createDocument()` is the entry point; there is no global `document`.

---

## 6. Running the tests — READ THIS FIRST

### 6.1 woby has no test runner at the package root

Verified:

- **No `vitest.config.*`, no `playwright.config.*`.** The only config at the root is
  `vite.config.mts`.
- `package.json`'s script is `"test": "pnpm --filter=./demo/playground test"`, and
  playground's own is `"tsx --tsconfig tsconfig.json src/test.tsx"` — a hand-rolled
  script runner, no assertion framework, and `tsx` is its only test devDependency.
- The only `*.test.ts` in `src/` is `src/components/error_boundary.test.ts x` — note the
  trailing space-x in the filename, i.e. deliberately disabled.

**So there is a decision to make before a single spec is written.** Three options:

1. **Add vitest to `woby` itself.** `vitest.config.ts` with `environment: 'node'` and no
   setup file at all — that is the honest environment for SSR, and it is the one thing
   these features are for. Cost: a new devDependency on the framework package.
2. **Extend `demo/playground/src/test.tsx`.** Zero new dependencies, matches the existing
   convention, and the `runSSRTest()`-returning-boolean idiom already used across su-yen
   (see `packages/report/src/test/区块外框.test.tsx`) drops straight in. Cost: no `describe`/
   `expect`, so assertions are hand-written; no watch mode.
3. **Put the specs in a consumer.** They would run today with no config work, but they
   would test woby from behind its `dist/` build and would not live with the code.

Recommendation: **option 1**. This is framework code with a real API surface and ~40
distinct cases; hand-rolled assertions will not carry that. `environment: 'node'` with no
setup file is also itself a test — if a spec needs a `window` shim to pass, the SSR path
has a browser assumption in it.

### 6.2 If you pick vitest

Two traps this monorepo has already hit:

- **Dual woby instances are a silent catastrophe.** If a config resolves `woby` two ways
  (source alias in one place, `dist` in another), you get two `EnvironmentContext` symbols,
  `useEnvironment()` returns `undefined`, `resolveChild` takes the browser branch, and soby
  recurses into `RangeError: Maximum call stack size exceeded`. Pin a single alias.
- **`defineConfig((env) => …)`**: vitest runs with `env.command === 'serve'`. A `test`
  block attached to the *lib* branch of such a config is silently inert.

### 6.3 Reference specs to copy the idiom from

Three files in the su-yen monorepo already do this, and are the fastest way to see the
shape:

| file | shows |
|---|---|
| `packages/bazi/tests/Expander.test.tsx` | vitest + `renderToString`; props as observables because SSR CEs take them through the constructor; the `wobyCustomElements.get(tag)` / `ssr.customElements.get(tag)` / `new 类({…}).outerHTML` pattern |
| `packages/report/src/test/区块外框.test.tsx` | `ssr.createDocument()`, node-by-node tree building, `querySelector`/`querySelectorAll`/`remove()`/`parentElement`/`hasAttribute` in anger, and the `描述()` helper for the circular-`JSON.stringify` problem |
| `packages/qmdj/tests/ssr-setup.ts` | the shim seam for third-party modules that touch a browser at **module scope** — and, in its closing comment, why it deliberately does **not** define `HTMLElement` (so `customElement()` takes the SSR branch, §3.1) |

### 6.4 Before running anything

`dist/` was rebuilt with `npx vite build`, but **types have not been re-emitted** since.
The new `BaseNode` members and every `selector.ts` export are missing from
`dist/types/`, so any consumer that type-resolves woby through `dist/types/index.d.ts`
will not see them.

```sh
cd D:/Developments/tslib/@woby/woby
npx tsc --declaration --emitDeclarationOnly --declarationMap
npx vite build          # only if src changed since the last build
```

**Do not run `pnpm build`** — it is `run-s clean declaration build:only bump` and the
`bump` step increments the package version.

There are also stale `.d.ts` / `.d.ts.map` artifacts sitting **inside** `src/ssr/` and
`src/components/` from an older emit. They are harmless but confusing; worth clearing
before the emit above so the new output is unambiguous.

Downstream: any su-yen package consuming woby from `dist` needs
`pnpm run build:only` in its own dep chain before the change is live there.

---

## 7. Change set, for reference

```
 M src/methods/custom_element.ts   +18  −0    §3 rows 8, 9
 M src/ssr/base_node.ts           +109  −5    §2.1, §2.3, §3 rows 1–5
 M src/ssr/document.ts             +45  −8    §2.2, §2.3
 M src/ssr/element.ts              +11  −2    §3 rows 6, 7
 M src/ssr/index.ts                 +1  −0    export * from './selector'
 M src/utils/diff.ts               +19  −4    §3 row 10
 M src/utils/lang.ts                +7  −1    §3 row 11
?? src/ssr/selector.ts            +275         §1  (new)
```
