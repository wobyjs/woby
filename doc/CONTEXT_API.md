# Context API Documentation

The Context API in Woby provides a way to pass data through the component tree without having to pass props down manually at every level. It's especially useful for global data like themes, user authentication, or preferred language.

## Quick Links

- **[Quick Reference Guide](./CONTEXT_API_QUICK_REFERENCE.md)** - Fast lookup for common patterns
- **[Comprehensive Examples](./CONTEXT_API_EXAMPLES.md)** - Detailed usage examples
- **[Historical Deprecation Notice](./DEPRECATION_useMountedContext_useAttached.md)** - Migration guide from useMountedContext (completed)
- **[Update Summary](./CONTEXT_API_UPDATE_SUMMARY.md)** - Overview of documentation updates

## Table of Contents

- [createContext](#createcontext)
- [useContext](#usecontext)
- [Custom Element Context Support](#custom-element-context-support)

## createContext

Creates a context object that can be used to pass data through the component tree.

### Syntax

```typescript
const Context = createContext<T>(defaultValue?: T)
```

### Parameters

- `defaultValue` (optional): The default value for the context when no Provider is found in the component tree.

### Returns

A context object with:
- `Provider`: A component that allows consuming components to subscribe to context changes
- `symbol`: A unique symbol used internally for context identification

### Example

```tsx
import { createContext, useContext } from 'woby'

// Create a context with a default value
const ThemeContext = createContext('light')

// Create a context without a default value
const UserContext = createContext<User | undefined>(undefined)

// Use the Provider to pass a value down the tree
const App = () => (
  <ThemeContext.Provider value="dark">
    <Toolbar />
  </ThemeContext.Provider>
)

// Consume the context value in a component
const ThemedButton = () => {
  const theme = useContext(ThemeContext)
  return <button className={theme}>Themed Button</button>
}

// Advanced: Using visible prop to render provider as DOM node
const DebugApp = () => (
  <ThemeContext.Provider value="dark" visible={true}>
    <Toolbar />
  </ThemeContext.Provider>
)

// Advanced: Using isStatic prop for non-reactive values
const StaticApp = () => (
  <ThemeContext.Provider value="light" isStatic={true}>
    <Toolbar />
  </ThemeContext.Provider>
)
```

## useContext

Accesses the current value of a context within a functional component. This hook works seamlessly in both JSX/TSX components and custom elements.

### Syntax

```typescript
const value = useContext(Context)
```

### Parameters

- `Context`: The context object created by `createContext`

### Returns

- The current context value from the nearest Provider above the calling component
- The default value if no Provider is found
- `undefined` if no Provider is found and no default value was specified

### Example

```tsx
import { createContext, useContext } from 'woby'

// Create a context
const ThemeContext = createContext('light')

// Use in JSX components
const ThemedButton = () => {
  const theme = useContext(ThemeContext)
  return <button className={`theme-${theme}`}>Click me</button>
}

// Use in custom elements
const ThemedElement = defaults(() => ({}), () => {
  const theme = useContext(ThemeContext)
  return <div>Theme: {theme}</div>
})

customElement('themed-element', ThemedElement)
```

### Usage in HTML Custom Elements

```tsx
const ReaderContext = createContext<string>('')
const OtherContext = createContext<string>('')

customElement('reader-context', ReaderContext.Provider)
customElement('other-context', OtherContext.Provider)

const TestContextHookHtml = (): JSX.Element => {
    const Reader = defaults(() => ({}), () => {
        const ctx = useContext(readerContext)
        const oth = useContext(otherContext)
        return <p>{ctx} other: {oth}</p>
    })

    customElement('test-reader', Reader)

    return () => (
        <div dangerouslySetInnerHTML={{
            __html: `
            <h3>Context - Hook in HTML</h3>
                <other-context value="123">
                <reader-context value="outer">
                    <p>header</p>
                    <test-reader></test-reader>
                    <reader-context value="inner">
                        <test-reader></test-reader>
                    </reader-context>
                    <test-reader></test-reader>
                    <p>Footer</p>
                </reader-context>
            </other-context>
            `}}>
        </div>
    )
}
```

### Usage in TSX Components

```tsx
const TestContextHook = (): JSX.Element => {
    const Context = createContext('')

    const Reader = (): JSX.Element => {
        const value = useContext(Context)
        return <p>{value}</p>
    }

    return () => (
        <>
            <h3>Context - Hook</h3>
            <Context.Provider value="outer">
                <Reader />
                <Context.Provider value="inner">
                    <Reader />
                </Context.Provider>
                <Reader />
            </Context.Provider>
        </>
    )
}
```

### Multiple Siblings Example

```tsx
import { createContext, useContext } from 'woby'

const UserContext = createContext<string>('anonymous')

// Define sibling components that consume context
const Sibling1 = () => <p>First: {useContext(UserContext)}</p>
const Sibling2 = () => <p>Second: {useContext(UserContext)}</p>
const Sibling3Nested = () => <p>Nested: {useContext(UserContext)}</p>
const Sibling4 = () => <p>Last: {useContext(UserContext)}</p>

const App = () => (
  <UserContext.Provider value="multi-test">
    <Sibling1 />
    <Sibling2 />
    <div>
      <Sibling3Nested />
    </div>
    <Sibling4 />
  </UserContext.Provider>
)
```

### Nested Providers with Position-based Context

```tsx
import { $, $$, createContext, useContext } from 'woby'

const ThemeContext = createContext<'light' | 'dark'>('light')

const App = () => {
  return (
    <ThemeContext.Provider value="outer">
      {/* First child */}
      <p>{useContext(ThemeContext)} {/* outputs: "outer" */}</p>
      
      {/* Second child */}
      <span>separator</span>
      
      {/* Third child - nested provider */}
      <ThemeContext.Provider value="inner">
        {/* Children inside nested provider get "inner" value */}
        <p>{useContext(ThemeContext)} {/* outputs: "inner" */}</p>
        <div><span>nested content</span></div>
        <p>{useContext(ThemeContext)} {/* outputs: "inner" */}</p>
      </ThemeContext.Provider>
      
      {/* Last child - back to outer context */}
      <p>{useContext(ThemeContext)} {/* outputs: "outer" */}</p>
    </ThemeContext.Provider>
  )
}
```

## Custom Element Context Support

Custom elements created with Woby's `customElement` function have special support for context. The context value is stored on the first child node of the parent element and can be accessed by child custom elements.

### How it works

1. For JSX/TSX components, `useContext` uses the standard context provider pattern
2. For custom elements, it automatically retrieves context from parent elements using the DOM hierarchy
3. The context lookup traverses up the DOM tree to find the nearest context provider
4. No special hooks are needed - `useContext` works everywhere
5. **Invisible by default**: In JSX, Context.Provider doesn't render a DOM node (React-like behavior)
6. **Visible option**: Use `visible={true}` prop to render `<context-provider>` as a DOM node
7. **Static values**: Use `isStatic={true}` for non-reactive context values

### Provider Behavior

- **JSX usage** (`<Context.Provider value={...}>`): Invisible wrapper, no DOM node rendered by default
- **Custom element usage** (`<context-provider value="...">`): Always renders as DOM node
- **Visible JSX usage** (`<Context.Provider visible={true}>`): Renders as `<context-provider>` DOM node

### Example

```tsx
// Create a context
const ValueContext = createContext(0)

// Create a custom element that uses context with useContext
const ValueDisplay = defaults(() => ({}), () => {
  const value = useContext(ValueContext)
  return <div>Value: {value}</div>
})

customElement('value-display', ValueDisplay)

// Usage in HTML:
// <value-context-provider value="42">
//   <value-display></value-display>
// </value-context-provider>
```

### Context in Shadow DOM

For custom elements using Shadow DOM, the context lookup traverses through shadow boundaries and slots to find the nearest context provider in the light DOM.

## `@`-Prefix Context Resolution in HTML Attributes

Woby's `@`-prefix feature lets you reference context values directly in HTML attributes — no `useContext()` needed inside the component. This is especially useful for **generic UI components** that receive their configuration from context without needing `useContext()` boilerplate.

### Basic Usage

```typescript
import { createContext, registerContextRef } from 'woby'

// Create a context with a default value
const AppCounterCtx = createContext(0)

// Register it for @-prefix resolution — the name is arbitrary,
// use dotted names like "scope.field" for organization
registerContextRef('app.count', AppCounterCtx)

// Now ANY custom element below a provider can consume it via HTML attributes:
// <my-element count="@app.count" />

// Use the provider as usual:
<AppCounterCtx.Provider value={42}>
  <my-element count="@app.count" />
  {/* my-element receives count=42 */}
</AppCounterCtx.Provider>
```

### How It Works

1. **Registration**: `registerContextRef('scope.key', Context)` stores the context's symbol and default value in a global registry, keyed by the dotted name.
2. **Interception**: When a custom element's HTML attribute value starts with `@` (but not `@@`), the `setObservableValue` function in `custom_element.ts` intercepts it BEFORE normal type conversion (HtmlNumber, HtmlBoolean, etc.).
3. **Resolution**: `resolveContextRef()` looks up the registered context by trying progressively shorter dotted-key matches (e.g. `@a.b.c` → tries `a.b.c`, `a.b`, `a`), then walks the element's DOM ancestors to find the nearest provider, and returns the provider's reactive observable.
4. **Reactivity**: The resolved value IS the provider's observable — so when the provider updates, the consuming element's prop updates reactively. No manual re-render or `useEffect` needed.

### Pattern: Generic UI Components

```tsx
// counter-element.tsx — generic counter that reads from context via @-prefix

// No import of AppCounterCtx needed — the @-prefix resolves it

const CounterEl = defaults(() => ({
  count: $(0, HtmlNumber),
  label: $('Count')
}), ({ count }) => {
  return <div>Value: {count}</div>
})

customElement('counter-element', CounterEl)

// Usage in HTML:
// <AppCounterCtx.Provider value={42}>
//   <counter-element count="@app.count"></counter-element>
// </AppCounterCtx.Provider>
```

### Escape Syntax: `@@` for Literal `@` Values

If an attribute value genuinely starts with `@`, use `@@` as the escape prefix — the first `@` is stripped and the remainder passes through normal type conversion:

```html
<!-- "@@literal" → "@literal" → passes through HtmlNumber/HtmlBoolean normally -->
<my-element text="@@some-text" />
<!-- → resolves to the string "@some-text" (or HtmlNumber/HtmlBoolean conversion) -->
```

### Fallback Behavior

| Case | Behavior |
|------|----------|
| `@registered.key` with provider in DOM | Returns provider's reactive value (observable) |
| `@registered.key` without provider | Returns context's registered `defaultValue` |
| `@unknown.ref` not registered | `console.warn`, returns `undefined` |
| `@@something` escaped | Strips first `@`, passes through normal type conversion |
| Non-writable observable prop | Falls through to existing plain-string assignment |

### Multiple Scopes

Each consumer walks up from its own DOM element, so nested providers work naturally — each consumer sees its **nearest ancestor**:

```tsx
<AppCounterCtx.Provider value={100}>
  <div>Outer provider</div>
  <AppCounterCtx.Provider value={200}>
    <counter-element count="@app.count" label="Inner: " />
    {/* → count = 200 */}
  </AppCounterCtx.Provider>
  <counter-element count="@app.count" label="Outer: " />
  {/* → count = 100 */}
</AppCounterCtx.Provider>
```

### Shadow DOM and Custom Element Boundaries

The `@`-prefix resolution walks the **composed DOM tree** (crossing shadow boundaries via `assignedSlot`, `parentNode`, and `host`) to find the nearest provider. This means:

- **Slotted descendants** inside a custom element's shadow DOM can still resolve context from ancestors in the light DOM.
- **Nested custom elements** each resolve independently from their own position in the DOM tree.
- **JSX-only providers** (invisible, no DOM node) work for JSX children but NOT for natively-upgraded slotted descendants — those need a visible provider (`<context-provider>`) or a custom element wrapper.

### API Reference: `registerContextRef`

```typescript
import { registerContextRef, unregisterContextRef } from 'woby'

interface Context<T> {
  Provider: ComponentWithDefaults<...>
  symbol: symbol
}

registerContextRef(name: string, ctx: Context<any>): void
```

- **`name`**: Dotted key for `@`-prefix lookup (e.g. `"theme.colors"`, `"app.count"`). Progressively shorter key matching is used during resolution.
- **`ctx`**: The context object returned by `createContext()`.
- **`unregisterContextRef(name)`**: Removes a previously registered context ref from the global registry.

**`context_ref` module exports:**
- `registerContextRef(name, ctx)` — Register context for `@`-prefix resolution
- `unregisterContextRef(name)` — Remove a registration
- `resolveContextRef(ref, element?)` — Manually resolve a `@`-prefixed string to a value
- `isContextRef(value)` — Check if a string starts with `@` (and not `@@`)

### Comparison: `@`-prefix vs `useContext`

| Aspect | `@`-prefix | `useContext()` |
|--------|-----------|---------------|
| **Where used** | HTML attributes, raw HTML templates | Inside component functions (JSX/TSX) |
| **Boilerplate** | Register once, use `@scope.key` anywhere | Import context, call `useContext()` each time |
| **Reactivity** | Automatic — resolves to provider's observable | Same — returns the observable |
| **DOM walk** | Required (walks ancestors) | Ambient via soby's ownership tree |
| **Best for** | Generic HTML components, 3rd-party elements | Application-level components, complex logic |
| **Setup** | `registerContextRef()` at app init | Import `createContext` + import context |

> **Note**: The `@`-prefix feature does NOT replace `useContext` for JSX components — it complements it. `useContext` remains the recommended way to consume context inside JSX/TSX component logic. The `@`-prefix is designed for the **HTML attribute boundary**, where a component cannot imperatively call `useContext()`.