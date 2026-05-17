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
Context:      createContext  useContext
Elements:     ElementAttributes  HtmlNumber  HtmlBoolean  HtmlDate  HtmlBigInt  HtmlFunction
Hooks:        useEventListener  useFetch  useResource  useResolved  useMounted  useContext
Components:   Dynamic  ErrorBoundary  Fragment  KeepAlive  Portal  Suspense
Utils:        isObservable  isStore  isFunction  isNode  castArray  mark  noop  setProp
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
6. Using `use()` — not exported. Use `useMemo()`.
7. Event double-firing — missing `e.stopPropagation()` in custom element event handlers.
8. Pattern 2 event props — `typeof onClick === 'function'` is always true; must unwrap with `(onClick as any)?.()` first.
9. `useContext()` returns observable — don't compare or use in logic without `$$()` unwrap.
10. No key prop needed — woby tracks list items automatically; adding `key` does nothing useful.
