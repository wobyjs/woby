---
name: woby
description: >
  Woby framework reference for AI agents building apps with woby. Very different from React — no VDOM, no hooks rules, no dependency arrays, no stale closures. Covers $() observables, $$() unwrap, JSX reactivity, custom elements, event handler prop wiring, context observables, useMemo forwarding, HtmlNumber/HtmlBoolean/HtmlFunction converters, and common pitfalls. Invoke this skill for any woby/soby code, observable patterns, custom element registration, or JSX reactive expression questions.
---

# Woby Framework — AI Agent Reference

Woby is fundamentally different from React. Read every section — the mental model needs to be rebuilt from scratch.

## The Core Mental Model

```
Observable = a function that is both getter and setter

const count = $(0)     // create
count()                // get current value
count(5)               // set to 5
count(c => c + 1)      // update with function
$$(count)              // also get — but ONLY in reactive contexts
```

**$$(x) vs x():** Both read the observable. Use `$$` inside reactive computations (effects, memos, JSX functions). Use `x()` in event handlers and non-reactive code. The difference: `$$` registers a dependency; `x()` does not.

---

## Observables (Signals)

```typescript
import { $, $$, useMemo, useEffect } from 'woby'

const count = $(0)
const name = $('John')
const items = $<string[]>([])

// Three ways to update
count(10)               // set
count(c => c + 1)       // functional update
count(count + 1)        // auto-unwrap via valueOf()

// Computed (derived) — auto-tracks dependencies
const doubled = useMemo(() => $$(count) * 2)

// Side effects — auto-tracks dependencies
useEffect(() => {
  console.log('count changed:', $$(count))
  return () => { /* cleanup */ }
  // NO dependency array — tracks whatever $$ is called inside
})
```

---

## JSX Reactivity — The Key Difference from React

React renders when state changes. Woby renders **specific nodes** when observables change. This means the placement of observables in JSX matters a lot.

```typescript
// ✅ REACTIVE — woby will update this text node when count changes
<div>{count}</div>                     // direct observable
<div>{() => $$(count) * 2}</div>       // function expression
<div>{useMemo(() => $$(count))}</div>  // memo

// ❌ NOT REACTIVE — runs once at render, never again
<div>{$$(count)}</div>                 // unwrapped at render time

// ✅ REACTIVE conditional
<div>{() => $$(isVisible) && <span>Hello</span>}</div>

// ❌ NOT REACTIVE conditional — renders once only
<div>{$$(isVisible) && <span>Hello</span>}</div>

// ✅ REACTIVE list
<ul>{() => $$(items).map(i => <li>{i}</li>)}</ul>

// ❌ NOT REACTIVE list
<ul>{$$(items).map(i => <li>{i}</li>)}</ul>
```

**Rule:** Any JSX expression that reads an observable must be wrapped in a function `() => ...` OR passed as a direct observable reference `{obs}`. Plain `{$$(obs)}` runs once and stops tracking.

---

## Stores (Deep Reactive Objects)

```typescript
import { store, $$ } from 'woby'

const user = store({ name: 'John', age: 30, todos: [] })

// Read — each nested property is itself an observable
$$(user.name)       // 'John'
$$(user.todos)      // []

// Write — call like an observable
user.name('Jane')
user.todos[0].done(true)

// In JSX
<p>{user.name}</p>  // reactive
```

---

## Components — No VDOM, No Hooks Rules

Components are plain functions. Return JSX. Hooks can be called conditionally, inside loops, wherever.

```typescript
const Counter = ({ value }: { value: Observable<number> }) => {
  const isHigh = useMemo(() => $$(value) > 10)

  return (
    <div>
      <p>Count: {value}</p>
      {() => $$(isHigh) && <span style={{ color: 'red' }}>Too high!</span>}
      <button onClick={() => value(v => v + 1)}>+</button>
    </div>
  )
}
```

No component re-renders. Only the specific DOM nodes that read changed observables update.

---

## Context API

```typescript
import { createContext, useContext } from 'woby'

const ThemeCtx = createContext('light')

const Child = () => {
  const theme = useContext(ThemeCtx)
  // theme is an observable when the value prop is reactive
  return <div class={theme}>Content</div>   // reactive: updates when context value changes
}

<ThemeCtx.Provider value="dark">
  <Child />
</ThemeCtx.Provider>
```

### Critical: `useContext()` returns an observable

When a `Context.Provider` receives a `value` prop that went through woby's `defaults()`/`make()` (e.g., came from a JSX attribute), `useContext()` returns the observable wrapper, not the raw value.

```typescript
const ctx = useContext(MyCtx)  // Observable<number>, not number

// ✅ correct uses
<p>{ctx}</p>                              // direct in JSX — reactive
<p>{() => `Value: ${$$(ctx)}`}</p>        // function — reactive
message(`Value: ${ctx}`)                  // template literal — works (fn.toString() resolves it)

// ❌ wrong
const val = ctx            // val is the observable function, not the value
if (ctx > 0) { ... }       // compares function to number — always true!
```

Always `$$()` unwrap context values in logic: `if ($$(ctx) > 0) { ... }`

### `@`-Prefix Context Resolution

Reference context values directly in HTML attributes — no `useContext()` inside the component:

```typescript
import { createContext, registerContextRef } from 'woby'

// 1. Create context as usual
const ThemeCtx = createContext('light')

// 2. Register for @-prefix resolution
registerContextRef('theme', ThemeCtx)

// 3. Use @-prefix in HTML attributes
// <my-element color="@theme" />
// → my-element receives the provider's current value (reactive)

// Full example:
<ThemeCtx.Provider value="dark">
  <my-element color="@theme" />
  {/* → color = "dark", updates when provider value changes */}
</ThemeCtx.Provider>
```

**How it works**: When `setObservableValue` sees an attribute value starting with `@`, it resolves the registered context symbol, walks DOM ancestors to find the nearest provider, and returns the provider's reactive observable. The consumer's prop updates automatically.

**`@@` escape**: `@@literal` → `"@literal"` (passes through normal type conversion).

**Key exports**: `registerContextRef(name, ctx)`, `unregisterContextRef(name)`, `resolveContextRef(ref, element?)`, `isContextRef(value)`.

---

## Custom Elements (Web Components)

Custom elements require `defaults()` so props are reactive and can be wired from HTML attributes.

### Step 1: Wrap with `defaults()`

```typescript
import { $, $$, useMemo, customElement, defaults, HtmlNumber, HtmlBoolean } from 'woby'

const Counter = defaults(
  () => ({
    // ALL props must be $() — this is what makes HTML attributes reactive
    count: $(0, HtmlNumber),  // HtmlNumber: converts string "5" → number 5
    title: $('Counter'),      // string: no converter needed
    active: $(true, HtmlBoolean),
  }),
  ({ count, title, active }) => {
    const doubled = useMemo(() => $$(count) * 2)
    return (
      <div>
        <h1>{title}</h1>
        <p>Count: {count}</p>
        <p>Doubled: {doubled}</p>
        <button onClick={() => count(c => c + 1)}>+</button>
      </div>
    )
  }
)

customElement('counter-element', Counter)
```

### Step 2: HTML Attribute Type Converters

HTML attributes are always strings — converters handle the coercion:

| Type | Converter | Example |
|------|-----------|---------|
| number | `HtmlNumber` | `$(0, HtmlNumber)` |
| boolean | `HtmlBoolean` | `$(false, HtmlBoolean)` |
| Date | `HtmlDate` | `$(new Date(), HtmlDate)` |
| BigInt | `HtmlBigInt` | `$(BigInt(0), HtmlBigInt)` |
| Function | `HtmlFunction` | `$(null, HtmlFunction)` |
| Object/Array | custom | `$({}, { toHtml: JSON.stringify, fromHtml: JSON.parse })` |
| string | none | `$('')` |

### Step 3: Derive Values with `useMemo`

```typescript
// ✅ correct — useMemo creates a reactive computed
const doubled = useMemo(() => $$(count) * 2)
const style = useMemo<CSSProperties>(() => ({
  color: $$(count) > 5 ? 'green' : 'red'
}))
```

> **NOTE:** `use()` is NOT exported from woby. Use `useMemo()` for all derived/computed values.

### Step 4: Declare TypeScript JSX types

```typescript
declare module 'woby' {
  namespace JSX {
    interface IntrinsicElements {
      'counter-element': ElementAttributes<typeof Counter>
    }
  }
}
```

### Usage in HTML and JSX

```html
<!-- HTML: attributes are strings -->
<counter-element count="5" title="My Counter" active="true"></counter-element>

<!-- Nested props use $ separator -->
<counter-element style$color="red" config$debug="true"></counter-element>
```

```tsx
// JSX: can pass observables directly
<counter-element count={$(5)} title="My Counter" />
```

---

## Event Handler Prop Wiring — Three Patterns

This is one of the most error-prone areas. Choose the right pattern or events will double-fire or never fire.

### Pattern 1: Non-reactive plain function (most common)

Use when the handler is known at render time and doesn't need to change.

```typescript
const ClickableElement = defaults(
  () => ({
    label: $('Click Me'),
    onClick: null as (() => void) | null,   // NO $() wrapper
  }),
  ({ label, onClick }) => {
    const handleClick = (e: Event) => {
      e.stopPropagation()  // required in custom elements — see note below
      if (typeof onClick === 'function') {
        onClick()
      }
    }
    return <button onClick={handleClick}>{label}</button>
  }
)
customElement('clickable-element', ClickableElement)

// Consumer:
<clickable-element onClick={handler} />
```

**Why `e.stopPropagation()`?** Woby uses document-level event delegation and walks `event.composedPath()` through the shadow DOM boundary. Without stopPropagation, woby's delegation loop reaches the host element's `_onclick` property and fires the handler a second time after you already called it inside `handleClick`.

### Pattern 2: Reactive observable function

Use when the handler may change after mount (e.g., swapped from parent state).

```typescript
const ClickBtnExternal = defaults(
  () => ({
    label: $('Click'),
    onClick: $(null as (() => void) | null),  // WITH $() wrapper
  }),
  ({ label, onClick }) => {
    const handleClick = () => {
      // Must unwrap the observable first, then check/call the inner value
      const fn = (onClick as any)?.()     // call observable → get inner function
      if (typeof fn === 'function') fn()
    }
    return <button onClick={handleClick}>{label}</button>
  }
)
```

**Why `(onClick as any)?.()`?** When `onClick` has a `$()` default, woby stores the incoming prop inside the observable. `onClick` itself is the observable (a function). Calling `onClick()` with no args returns the stored function. Then you call that.

> **Pitfall:** `typeof onClick === 'function'` is always true in Pattern 2 — `onClick` is an observable, which IS a function. Always unwrap first.

### Pattern 3: HtmlFunction for HTML attribute / JS assignment

Use when the element needs to accept onclick string attributes or JS-assigned handlers crossing the HTML boundary.

```typescript
import { HtmlFunction } from 'woby'

const WebBtn = defaults(
  () => ({
    onClick: $(null as [Function] | undefined, HtmlFunction),
  }),
  ({ onClick }) => (
    <button onClick={onClick as any}>Click</button>
  )
)
```

`HtmlFunction` uses reference equality for comparison. Functions cannot be serialized to HTML attributes — this converter enables JS-assignment interop (`element.onClick = fn`).

### Pattern Comparison

| Pattern | Default | Unwrap to call | Stop propagation |
|---------|---------|----------------|-----------------|
| Plain function | `onClick: null` | `onClick()` directly | Yes |
| Observable function | `onClick: $(null)` | `(onClick as any)?.()` then call | Yes |
| HtmlFunction | `onClick: $(null, HtmlFunction)` | Pass as JSX prop | N/A |

---

## Prop Forwarding Between Components

Observable props flow through naturally — direct passing preserves reactivity.

```typescript
// Parent has an observable
const value = $(42)

// ✅ forward directly — child stays reactive
<child-element value={value} />

// ✅ forward derived — useMemo for computation
const doubled = useMemo(() => $$(value) * 2)
<child-element value={doubled} />

// ✅ forward inline — function expression
<child-element value={() => $$(value) * 2} />

// ❌ forward unwrapped — breaks reactivity (snapshot only)
<child-element value={$$(value)} />
```

---

## `useMemo` Returning JSX as a Child — Reconstruction Trap

Do **not** wrap a JSX subtree in `useMemo` just to "build it once" and drop it in as `{child}`. A memo is an **observable**, and when an observable is a child, woby binds it with a `useRenderEffect` that re-runs whenever the memo notifies **or** whenever any observable read *inside the subtree build* changes. Because element construction (and especially a custom element's `new ce(props)`) is **not** untracked, the reads that fire while the subtree is (re)built become dependencies of that mount effect — so the whole subtree gets torn down and rebuilt on every one of those changes.

```typescript
// ❌ TRAP — memo-as-child ⇒ re-runnable useRenderEffect that tracks every read
//    made while building <expensive-grid> (incl. its internal reactive reads).
//    Each date change → effect re-runs → full <expensive-grid> reconstruction.
const core = useMemo(() => (
  <div class="page">
    <expensive-grid date={date} /* CE reads $$(date) during construction */ />
  </div>
))
return <>{core}</>

// ✅ FIX — a plain const holds the raw element thunk (a NON-reactive function).
//    resolveChild calls it ONCE, inside the fragment's untracked child-setting.
//    Built once, never re-entrant. The CE updates in place via its OWN reactivity.
const core = (
  <div class="page">
    <expensive-grid date={date} />
  </div>
)
return <>{core}</>
```

**Why the two behave differently:** a `<div/>`/`<my-el/>` JSX expression compiles to a marked *wrapElement thunk* — a non-reactive function. As a child it is resolved **once** via the immediate-call path, and if that happens inside an untracked scope (a component's own child-setting is untracked) nothing subscribes to the reads made during the build. A `useMemo(...)` wrapping the same JSX turns it into an observable, which as a child gets the reactive `useRenderEffect` binding instead — the re-runnable path.

**Rule:** `useMemo` for a child is correct only when you *want* it to recompute/rebind on a dependency change. For a build-once static subtree, use a **plain const** (or inline the JSX directly). The reconstruction it prevents is pure waste — a custom element updates its own content in place through its internal reactivity; it never needs to be rebuilt to reflect new prop/observable values.

> Diagnosing it: instrument the memo body (`window.__coreRun++`) and the suspected child (a counter at the top of its component body). If the child's counter climbs on each interaction while the memo counter stays flat, the memo is innocent — the **mount effect** is re-running and tracking the child's internal reads. Switch the memo to a plain const.

---

## `Context.Provider` Inside a Reactive Child — Infinite Remount Loop

This is the **more severe sibling** of the reconstruction trap above. There, a re-runnable `{child}` *rebuilds* a subtree once per external change (wasteful, but finite). When the thing being mounted inside the re-runnable child is a **`Context.Provider`** (or a custom element that wraps one, e.g. `<sy-document-ctx>`), the rebuild becomes **self-sustaining and infinite** — it pegs the main thread and freezes the page.

```typescript
// ❌ TRAP — Provider mount gated by a reactive thunk ⇒ infinite remount loop.
//    The {() => …} child compiles to a useRenderEffect. Mounting the Provider
//    READS *and* WRITES woby's internal context observable during its own run,
//    so that observable becomes a dependency of the enclosing effect AND is
//    dirtied by it → the effect re-dirties itself → dispose+remount the Provider
//    → read+write again → … forever. Thread pegged, UI frozen.
{() => $$(有效)
  ? <ThemeCtx.Provider value="dark"><heavy-panel /></ThemeCtx.Provider>
  : null}

// ✅ FIX — mount the Provider ONCE in the static tree; gate its VISIBILITY
//    (not its mount) with a reactive class. Toggling display never disposes
//    or re-mounts the Provider, so the read→write→re-dirty cycle can't form.
<ThemeCtx.Provider value="dark">
  <div class={() => $$(有效) ? '' : 'hidden'}>   {/* Tailwind hidden = display:none */}
    <heavy-panel />
  </div>
</ThemeCtx.Provider>
```

**Why a Provider is uniquely dangerous here:** a plain `<div>`/`<my-el/>` in a re-runnable child only *rebuilds* — its construction reads may be tracked, but it does not feed its own dirtiness. A Provider's mount, by contrast, both reads and writes the internal context observable, so mounting it *inside* the effect that tracks that observable closes a self-re-dirty loop (soby `Observer.update`, observer.js). Finite reconstruction becomes an unbounded loop.

**Rule:** Never **mount-gate** a `Context.Provider` behind a reactive `{() => cond ? <Provider/> : null}` thunk. Mount it **once** in the static JSX and gate **visibility** with `class={() => cond ? '' : 'hidden'}` (or `style` `display`). Reactive thunks are fine around *leaf* content (text, tables, plain elements) — the hazard is specifically the Provider (and CEs wrapping one). If several heavy panels share the gate, give each its own toggle so at most one expensive fold mounts per interaction.

> Symptom signature: an unclosable dialog / fully frozen page (not a slow one) the instant a Provider-bearing branch flips visible; a CPU profile shows the renderer pegged in mount/dispose churn rather than idle. See also the memo-as-child trap above — same `useRenderEffect` mechanism, escalated by the Provider's write-back.

---

## Batching

```typescript
import { batch } from 'woby'

batch(() => {
  firstName('Jane')
  lastName('Smith')
})  // DOM updates once, not twice
```

---

## Key Exports Reference

```
Core:         $  $$  batch  untrack  resolve  tick  store
Reactivity:   useMemo  useEffect  useCleanup  useError  useRoot  useSelector
DOM/UI:       render  renderToString  customElement  defaults  assign  make  clone
Context:      createContext  useContext  registerContextRef  unregisterContextRef
Elements:     ElementAttributes  HtmlNumber  HtmlBoolean  HtmlDate  HtmlBigInt  HtmlFunction
Hooks:        useEventListener  useFetch  useResource  useResolved  useMounted  useContext
Components:   Dynamic  ErrorBoundary  Fragment  KeepAlive  Portal  Suspense
Utils:        isObservable  isStore  isFunction  isNode  castArray  mark  noop  setProp  resolveContextRef  isContextRef
SSR:          ssr.*  createDocument  isServer  renderToString
```

> There is no `use()` export. `useMemo()` is the correct API for derived values.

---

## React → Woby Cheatsheet

| React | Woby |
|-------|------|
| `useState(0)` | `$(0)` |
| `setState(5)` / `setState(s => s+1)` | `s(5)` / `s(s => s+1)` |
| `useEffect(() => {}, [dep])` | `useEffect(() => { $$(dep) })` — no array |
| `useMemo(() => x, [dep])` | `useMemo(() => $$(dep))` |
| `{cond && <X/>}` | `{() => $$(cond) && <X/>}` |
| `{arr.map(x => <li key={x.id}>)}` | `{() => $$(arr).map(x => <li>)}` — no key |
| `className` | `class` |
| `useRef()` / `ref={refObj}` | `useRef()` / `ref={el => ...}` (callback only) |
| Context: `createContext` / `useContext` | Same API, but `useContext` may return an observable |
| `React.lazy()` | `lazy()` |

---

## Common Pitfalls

1. `{$$(count)}` in JSX — renders once, never updates. Use `{count}` or `{() => $$(count)}`.
2. `{arr.map(...)}` without `() =>` — static render. Wrap in `{() => $$(arr).map(...)}`.
3. `if (ctx > 0)` — comparing observable function to number. Use `if ($$(ctx) > 0)`.
4. Forgetting `$()` in `defaults()` — HTML attributes won't update the component.
5. Forgetting `HtmlNumber` — number attributes arrive as strings, comparisons fail.
6. Using `use()` — not exported from woby. Use `useMemo()`.
7. Event double-firing — missing `e.stopPropagation()` in custom element event handlers.
8. Pattern 2 event props — `typeof onClick === 'function'` is always true; must unwrap with `(onClick as any)?.()` first.
9. `useContext()` returns observable — don't compare or use in logic without `$$()` unwrap.
10. No key prop needed — woby tracks list items automatically; adding `key` does nothing useful.
11. **`class` prop not forwarded into shadow DOM component** — `class` (and any other prop) is only reactive if it's declared as `$()` in `defaults()`. If it's missing from defaults, `attributeChangedCallback` assigns a plain string to `this.props.class` (non-reactive) AFTER the component has already rendered. Fix: add `class: $('')` to `defaults()`.

---

## cls Override, class Append Contract

Every Woby component MUST follow this contract for the `cls` and `class` props:

| Prop | Purpose | Behavior |
|------|---------|----------|
| `cls` | Consumer's override classes | **Replaces** default styles when provided |
| `class` | Consumer's append classes | **Added to** default styles |

```tsx
// CORRECT: cls overrides defaults, class appends
<div class={[() => $$(cls) ?? 'default-styles', class]}>

// WRONG: Both append (confuses consumer expectations)
<div class={['default-styles', cls]}>
```

**Usage:**
```tsx
<Comp cls="custom-override" class="custom-addon">
{/* Result: "custom-override custom-addon" */}
/* cls replaces defaults, class adds on top */
```

### Required in defaults() for Custom Elements

Both `cls` and `class` MUST be declared in `defaults()` for reactive HTML attribute support:

```typescript
const def = () => ({
    cls: $('') as ObservableMaybe<string>,   // Override (replaces defaults)
    class: $('') as ObservableMaybe<string>,  // Append (adds to defaults)
    // ... other props
})

const MyElement = defaults(def, (props) => {
    const { cls, class: className, children, ...rest } = props
    
    return (
        <div class={[() => $$(cls) ?? 'base-component', className]} {...rest}>
            {children}
        </div>
    )
})
```

### Why This Contract Matters

- **`cls`**: Consumer wants full control → replace default completely
- **`class`**: Consumer wants to extend → add without removing defaults

### Testing Your Component

Verify the class contract:

```tsx
// Test cls overrides defaults
expect(element.classList).toContain('custom-override')

// Test class appends to defaults
expect(element.classList).toContain('base-component')
expect(element.classList).toContain('user-addon')

// Test both together
<Comp cls="full-override" class="addon-class">
// Result: "full-override addon-class" (no defaults!)
```

### Using `dv1-6` CLI for Live Verification

The `dv1-6` CLI (Chrome DevTools Protocol wrapper) is the **primary tool** for verifying component behavior in a real browser — use it instead of raw WebSocket/CDP scripts:

```powershell
# Start Chrome — headed by default (dv* CLI v1.0.0; old --headed flag removed)
dv3 start

# Navigate to playground (url is POSITIONAL; `goto` is an alias)
dv3 navigate http://localhost:7214

# Read console logs (test results, errors)
dv3 console --type log            # all logs
dv3 console --type error          # errors only
dv3 console --filter "❌"          # scan buffer for a pattern
dv3 console --json                # machine-readable output

# Inspect DOM state (selector via -s/--selector)
dv3 inspect -s 'counter-element'
dv3 get-text -s '.result'

# Take a screenshot for visual verification (output path POSITIONAL)
dv3 screenshot screenshot.png

# Get accessibility snapshot (useful for SSR verification)
dv3 snapshot

# Evaluate arbitrary JS in the page
dv3 eval --script "document.querySelector('counter-element')?.shadowRoot?.innerHTML"
```

> **dv* CLI v1.0.0 (upgraded)** — flags became positional: `start` is headed by default (old `--headed` gone; `--headless` hides), `navigate <url>`/`new <url>` (old `--url`), `screenshot <output>` (old `--output`), `inspect|query-all|get-text|get-html` take `-s/--selector`, `click <selector>`/`fill <selector> <value>`/`resize <w> <h>` positional, `pages` → `tabs`, `close <tab-id>` (old `--page-id`). `console --type`, `eval --script`, `key --key` unchanged.

**When to use:**
- After rebuilding and restarting the dev server, use `dv* console` to check for errors
- Use `dv* inspect` or `dv* query-all` to verify DOM structure matches expectations
- Use `dv* screenshot` for visual regression checks

> **Never fall back to raw WebSocket/CDP scripts** (`require('ws')`, `new WebSocket`, `DevToolsAPI`) — `dv1-6` provides structured commands that handle port and page management automatically.

---

## Forwarding `class` from Custom Element Host into Shadow DOM

When a custom element is used with a class attribute (`<my-el class="...">`) and the component renders an inner element that should carry those classes, the class must be wired reactively through `defaults()`.

### Why it fails without `$()` in defaults

Woby's `customElement` reads `Object.keys(this.props)` at construction time to determine which props are observable. If `class` is NOT in `defaults()`, then:
- `class` is not in the observable prop list
- `attributeChangedCallback1` finds `this.props['class']` is undefined (not observable) and does plain `obj['class'] = value` — a one-time assignment
- The component already rendered (in the constructor, before `connectedCallback`) with `cls = undefined`
- No reactive update fires

### The fix

```tsx
const MyElementDefaults = () => ({
    // ... other props ...
    class: $(''),   // ← must be here so Woby tracks class as an observable prop
})

const MyElement = defaults(MyElementDefaults, (props) => {
    const { class: cls } = props
    // cls is now an Observable<string> — reactive when HTML attribute changes
    return <div class={[cls]}>...</div>
})
```

### How it works

1. `class: $('')` in defaults → Woby includes `class` in `observedAttributes` and treats it as reactive
2. In `connectedCallback`, `attributeChangedCallback1('class', undefined, 'foo bar')` calls `this.props.class('foo bar')` — updates the observable
3. The inner element's `class={[cls, ...]}` is inside a `useRenderEffect` (Woby's class array handling is always reactive)
4. The effect re-runs and applies the new class string to the inner element

### CSS cascade via `[&_td]:*` into shadow DOM

Tailwind's `[&_td]:p-2` generates `.[\&_td\]:p-2 td { padding: 0.5rem }` — a descendant selector.

When the inner `<table class="[&_td]:p-2">` is inside a Woby shadow DOM:
- Woby adopts all document stylesheets into the shadow DOM via `adoptedStyleSheets`
- The adopted Tailwind CSS contains the `.[\&_td\]:p-2 td` rule
- The `td` elements inside the shadow DOM are descendants of the inner table → selector matches ✓

**The class must be on the inner element (inside shadow DOM), not on the host.** The host's class only affects light DOM.

```tsx
// ✅ class on inner table — selectors like [&_td]:p-2 reach the shadow DOM td elements
return <table class={[cls]}>
    <tbody>...</tbody>
</table>

// ❌ class only on host — Tailwind [&_td]:p-2 won't pierce shadow DOM boundary
// (setting class on host via HTML attribute without forwarding to inner element)
```

---

## WUI Component Patterns

Additional patterns from the wui component library.

### untrack() - Prevent Infinite Loops

Use `untrack()` to read observable values without creating dependencies:

```tsx
import { untrack } from 'woby';

useEffect(() => {
    const val = $$(modDate);
    const parsed = parseDate(val);

    if (parsed) {
        // CRITICAL: untrack() prevents infinite loop
        // Without it, updating selectedYear would cause this effect to re-run
        if (untrack(selectedYear) !== parsed.getFullYear())
            selectedYear(parsed.getFullYear());
    }
});
```

### pick() - Composing Defaults

Use `pick()` to inherit defaults from parent components:

```tsx
import { pick } from 'woby';

const def = () => {
    // Get base defaults from parent
    const baseDefaults = parentDef();

    // Pick specific keys to inherit
    const inheritedKeys = ['cls', 'bottom', 'visible', 'mask'] as const;
    const inheritedDefaults = pick(baseDefaults, inheritedKeys);

    return {
        // Component-specific defaults
        options: $([]),
        value: $(null),
        // Inherited defaults
        ...inheritedDefaults
    };
};
```

### Static Property Pattern for Component Identification

Attach static properties to component functions for runtime detection:

```tsx
const StartAdornment = defaults(defStart, (props) => { /* ... */ });
StartAdornment.adornmentType = 'start';  // Static property

const EndAdornment = defaults(defEnd, (props) => { /* ... */ });
EndAdornment.adornmentType = 'end';  // Static property

// Usage: detect type at runtime
const getAdornmentType = (child: any) => child?.adornmentType || null;
```

### use() Hook from @woby/use

The `use()` hook from `@woby/use` provides observable values with fallback defaults:

```tsx
import { use } from '@woby/use';

const type = use(mode);  // Get observable value
const yearRange = use(yearRangeProp, { start: 1900, end: 2100 });  // With fallback
```

### Conditional Rendering with Function Return

Always return a function for reactive conditional rendering:

```tsx
return () => {
    return $$(isVisible) === false ? null : renderContent();
};
```

### Slot Element Handling

Handle both TSX children and HTML slot content:

```tsx
useEffect(() => {
    const childValue = $$(children);

    if (childValue instanceof HTMLSlotElement) {
        // HTML mode: extract text from slot
        const slot = childValue as HTMLSlotElement;
        const updateText = () => {
            const assignedNodes = slot.assignedNodes();
            const textContent = assignedNodes.map(n => n.textContent).join('');
            displayText(textContent);
        };
        slot.addEventListener('slotchange', updateText);
        return () => slot.removeEventListener('slotchange', updateText);
    } else {
        // TSX mode: children is already text
        displayText(String(childValue || ''));
    }
});
```

### Shadow DOM Light DOM Child Migration

Custom elements with Shadow DOM need to migrate light DOM children:

```tsx
useEffect(() => {
    const mainDiv = $$(mainRef);
    const contentDiv = $$(contentRef);
    if (!mainDiv || !contentDiv) return;

    const rootNode = mainDiv.getRootNode();
    const isShadow = rootNode instanceof ShadowRoot;

    if (isShadow) {
        const host = (rootNode as ShadowRoot).host as HTMLElement;
        const lightChildren = Array.from(host.children);

        lightChildren.forEach(node => {
            if (node.tagName.toLowerCase() === 'wui-tab') {
                contentDiv.appendChild(node);  // Moves node to shadow DOM
            }
        });
    }
});
```

---

## Build & TypeScript Compatibility — Agent Pitfalls

**These mistakes were made by AI agents and caused hours of debugging. Never repeat them.**

### ❌ NEVER create a `declare module 'woby'` augmentation file

```ts
// FORBIDDEN — DO NOT CREATE THIS FILE IN ANY PROJECT
declare module 'woby' {
  export { something } from '...'  // This shadows ALL real woby exports
}
```

A `declare module 'woby'` block — in ANY `.d.ts` file anywhere in the project — **completely replaces woby's real module declaration**. TypeScript will see only what's in the augmentation and nothing from the real `dist/types/index.d.ts`. The symptom is `Module '"woby"' has no exported member '$'` (and every other woby export) across every file.

**Diagnosis:** When you see `Module '"woby"' has no exported member X` for multiple different exports simultaneously, the FIRST thing to do is:
```
grep -r "declare module 'woby'" src/
```
If any `.d.ts` file has this, delete it immediately. Do NOT blame woby's types or TypeScript version first.

The correct way to add IntrinsicElements declarations is scoped — no module redeclaration:
```ts
// ✅ correct — extends the existing module
declare module 'woby' {
  namespace JSX {
    interface IntrinsicElements {
      'my-element': ElementAttributes<typeof MyComponent>
    }
  }
}
```
Even this is only needed for IntrinsicElements. Never re-export or redefine existing woby exports.

### TypeScript 6 upgrade checklist for tsconfig

When upgrading a woby-consuming package from TypeScript 5 to 6, update `tsconfig.json`:

```json
{
  "compilerOptions": {
    "ignoreDeprecations": "6.0",
    "noEmitOnError": false
  }
}
```

And make the declaration step non-blocking in `package.json`:
```json
"declaration": "tsc --declaration --emitDeclarationOnly --declarationMap || true"
```

### woby build chain (no fix-declarations)

The `fix-declarations.js` post-build script has been removed from woby. The correct build chain is:
```
run-s clean build:only declaration bump
```

`dist/types/jsx/types.d.ts` naturally generates with `export {};` — that is correct. The `declare global { namespace JSX { ... } }` inside it is sufficient for JSX type-checking without a UMD `export as namespace JSX;` declaration.

### Tailwind oxide native binding after pnpm reinstall

After running `pnpm install --no-frozen-lockfile`, the optional platform-specific binary `@tailwindcss/oxide-win32-x64-msvc` may be lost. Symptom:
```
Error: Cannot find native binding. npm has a bug related to optional dependencies
```
Fix: run `pnpm install` (no flags) at the workspace root. Do NOT delete `node_modules` or `pnpm-lock.yaml`.

---

## `defaults()` and Callback Props — Unwrap With `$$(x, false)`

`defaults()` wraps every default into an observable, **including `null` callback
defaults**. So a prop declared as `onChange: null` arrives inside the component as
`observable(null)` — a *function* — not as `null`. Calling it directly silently
does nothing useful, and `if (props.onChange)` is always true.

```tsx
const def = () => ({ onCommit: null as ((v: string) => void) | null })

const Editor = defaults(def, (props) => {
    // ❌ always truthy — this is the observable wrapper, not your callback
    if (props.onCommit) props.onCommit(value)

    // ❌ plain $$ calls the observable AND would call a function value
    const cb = $$(props.onCommit)

    // ✅ second arg `false` disables function-invocation, so a function *value*
    //    comes back as itself and a null default comes back as null
    const cb = $$(props.onCommit, false)
    if (typeof cb === 'function') cb(value)
})
```

The rule: **any prop whose value may legitimately BE a function must be unwrapped
with `$$(x, false)`.** With the default `$$(x)`, woby treats the function as a
thunk and calls it, so you get the *result* of your callback (usually `undefined`)
instead of the callback. Applies to `onChange`, `onCommit`, `render`, `format`,
and every other function-valued prop.

## SSR vs. Browser Serialization — Do Not Reconcile Them

`renderToString` and a live-DOM serializer legitimately disagree. Write **two**
expectations; never "fix" one to match the other.

| | `renderToString` (Node) | Live DOM (browser) |
| --- | --- | --- |
| void elements | self-closing — `<input … />` | `<input …>` |
| `checked` / `disabled` | reflected as an attribute — `checked=""` | stays a **property**; never appears as an attribute |
| custom elements | connect lifecycle never runs → near-empty tag, no context | fully upgraded, context propagates |

Two more traps:

- **Non-deterministic values must be pinned.** Auto-generated ids, dates, and
  random seeds make SSR and the browser disagree on every run. Fix them to
  constants inside test components.
- **Attribute order follows source order in both**, so don't sort — a diff in
  order is a real regression, not serializer noise.

## Two-Suite Snapshot Modules (the `@woby/wui` pattern)

One module per component drives **both** a Node `renderToString` run and a live
browser run from a single set of expectations. Structure:

```tsx
const name = 'TestButton'

const TestButton = (): JSX.Element => {
    const index = $(0)
    registerTestObservable(name, index)              // lets a runner drive the state
    useInterval(() => index(p => (p + 1) % 4), TEST_INTERVAL)
    const ret: JSX.Element = () => <Button {...states[index()]}>Go</Button>
    registerTestObservable(`${name}_ssr`, ret)       // lets renderToString re-render it
    return ret
}

// Node-only. Gate on a global the SSR runner sets — NOT on `typeof window`,
// which is also undefined in some bundler/worker contexts.
if (typeof globalThis.__isSSRTest__ !== 'undefined') {
    TestButton()
    for (let i = 0; i < fullElements.length; i++) {
        ;(testObservables[name] as any)(i)
        const ssr = renderToString(testObservables[`${name}_ssr`])
        console.log(`   State ${i}: ${ssr} ${ssr === fullElements[i] ? '✅' : `❌ (expected: ${fullElements[i]})`}`)
    }
    // Record, don't exit — see below.
    if (!allPassed) ((globalThis as any).__ssrFailures ??= []).push(name)
}

TestButton.test = { static: false, stateCount: 4, compareActualValues: true, expect: () => /* … */ }
export default () => <TestSnapshots Component={TestButton} />
```

Rules that keep the suite honest:

- **Record failures, never `process.exit` in a module.** The runner imports every
  module, so exiting on the spot destroys the actual/expected output of every
  module after yours. Push onto `globalThis.__ssrFailures` and let the runner exit
  non-zero once everything has run.
- **Always log actual *and* expected.** A bare "failed" costs a debugging round
  trip; the concrete diff names the attribute that drifted.
- **A branch that passes silently reports zero passes.** If the pass path only
  `console.log`s, an assertion counter stays at 0 and a green suite looks empty.
  Call `assert(true, …)` on success too.
- **Show it on the page, not only the console.** Devtools buffers cap around 1000
  messages, so a 20-module suite can lose its head. Publish each module's
  actual/expected pair into an observable and render it next to the component,
  plus one summary banner (modules / passed / failed / assertions).
- **One flat array is the registration point.** Keep a `tests` array in a single
  module and have the page map over it; hand-listing `<TestX />` tags in the app
  guarantees a module gets imported but never rendered.

## Portal Components Are Not Document-Centric — Exclude Them

`Portal`-based components (pickers, bottom sheets, wheelers, floating dialogs)
render **outside** their parent subtree. Any host that assumes "my children are my
DOM" — a document-centric rich-text editor, a serializing snapshot harness, a
drag-and-drop canvas — must **filter them out of its component registry**, not try
to make them work inside it.

Symptoms of getting this wrong: recursion when the host walks its own subtree,
selection/caret logic that loses the node, snapshots that come back empty, and
"fixes" that special-case the editor internals. The fix is always upstream —
exclude the Portal components from the registry — never downstream in the host.
