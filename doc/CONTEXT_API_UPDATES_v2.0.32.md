# Context API Updates - v2.0.32

This document covers the latest updates to the Woby Context API introduced in version 2.0.32.

## Summary of Changes

### 1. Added `visible` Prop to Context.Provider

The `visible` prop allows you to control whether the Context.Provider renders as a DOM node or remains invisible (React-like behavior).

#### Default Behavior (Invisible)

By default, Context.Provider in JSX is invisible and doesn't create a DOM node:

```tsx
import { createContext, useContext } from 'woby'

const ThemeContext = createContext('light')

// This provider is invisible - no <context-provider> DOM node is created
const App = () => (
  <ThemeContext.Provider value="dark">
    <Toolbar />
  </ThemeContext.Provider>
)
```

#### Visible Provider

Use `visible={true}` to render the provider as a `<context-provider>` DOM element:

```tsx
// Debug mode - provider renders as DOM node
const DebugApp = () => (
  <ThemeContext.Provider value="dark" visible={true}>
    <Toolbar />
  </ThemeContext.Provider>
)

// Output: <context-provider value="dark"><Toolbar /></context-provider>
```

#### Use Cases for Visible Providers

- **Debugging**: Inspect context values in DevTools
- **CSS Styling**: Target providers with CSS selectors
- **Layout Control**: Use providers as part of your DOM structure
- **Testing**: Verify context provider hierarchy in tests

### 2. Fixed `isStatic` Handling in useContext

The `isStatic` prop now correctly controls whether context values are treated as observables or static values.

#### Observable Context (Default)

```tsx
import { $, createContext, useContext } from 'woby'

const CounterContext = createContext(0)

const App = () => {
  const count = $(0) // Observable
  
  return (
    <CounterContext.Provider value={count}>
      <CounterDisplay />
    </CounterContext.Provider>
  )
}

const CounterDisplay = () => {
  const count = useContext(CounterContext)
  // Automatically tracks observable changes
  return <div>Count: {count}</div>
}
```

#### Static Context

```tsx
const StaticApp = () => {
  return (
    <CounterContext.Provider value={42} isStatic={true}>
      <CounterDisplay />
    </CounterContext.Provider>
  )
}

const CounterDisplay = () => {
  const count = useContext(CounterContext)
  // Static value, no observable tracking
  return <div>Count: {count}</div>
}
```

### 3. Improved Provider Behavior Detection

The Context.Provider now intelligently detects usage patterns:

- **JSX Usage**: Invisible by default (React-like)
- **Custom Element Usage**: Always renders as DOM node
- **Explicit Visible**: Use `visible={true}` to opt-in to DOM rendering in JSX

```tsx
// JSX - Invisible (default)
<ThemeContext.Provider value="dark">
  <Child />
</ThemeContext.Provider>

// Custom Element - Always visible
customElement('theme-context', ThemeContext.Provider)
// Renders: <theme-context value="dark"><child-element></child-element></theme-context>

// JSX with visible prop - Explicitly visible
<ThemeContext.Provider value="dark" visible={true}>
  <Child />
</ThemeContext.Provider>
// Renders: <context-provider value="dark"><child-element></child-element></context-provider>
```

## Complete Examples

### Example 1: Nested Providers with Multiple Siblings

```tsx
import { $, $$, createContext, useContext } from 'woby'

const UserContext = createContext<string>('anonymous')
const ThemeContext = createContext<'light' | 'dark'>('light')

// Define sibling components that consume context
const Sibling1 = () => <p>First: {useContext(UserContext)}</p>
const Sibling2 = () => <p>Second: {useContext(UserContext)}</p>
const Sibling3Nested = () => <p>Nested: {useContext(UserContext)}</p>
const Sibling4 = () => <p>Last: {useContext(UserContext)}</p>

const App = () => (
  <>
    <h3>Multiple Siblings Test</h3>
    <UserContext.Provider value="multi-test">
      <Sibling1 />
      <Sibling2 />
      <div>
        <Sibling3Nested />
      </div>
      <Sibling4 />
    </UserContext.Provider>
    
    {/* All siblings render with "multi-test" value */}
    {/* Output:
        <p>First: multi-test</p>
        <p>Second: multi-test</p>
        <div><p>Nested: multi-test</p></div>
        <p>Last: multi-test</p>
    */}
  </>
)
```

### Example 2: Position-based Context Values

```tsx
import { createContext, useContext } from 'woby'

const ThemeContext = createContext('default')

const App = () => {
  return (
    <ThemeContext.Provider value="outer">
      {/* First child gets "outer" */}
      <p>{useContext(ThemeContext)} {/* "outer" */}</p>
      
      {/* Regular element */}
      <span>separator</span>
      
      {/* Nested provider changes context */}
      <ThemeContext.Provider value="inner">
        {/* Children inside get "inner" */}
        <p>{useContext(ThemeContext)} {/* "inner" */}</p>
        <div><span>nested content</span></div>
        <p>{useContext(ThemeContext)} {/* "inner" */}</p>
      </ThemeContext.Provider>
      
      {/* Back to "outer" after nested provider */}
      <p>{useContext(ThemeContext)} {/* "outer" */}</p>
    </ThemeContext.Provider>
  )
}
```

### Example 3: Component Function as Children

```tsx
import { jsx, createContext, useContext } from 'woby'

const Context = createContext('')

const FnProviderChild = () => {
  const ctxValue = useContext(Context)
  return <p>Component function provider: {ctxValue}</p>
}

const App = () => {
  return (
    <>
      <h3>Context.Provider(value, () => ) Test</h3>
      {() => jsx(Context.Provider, {
        value: "component-function-value",
        children: FnProviderChild
      })}
      {/* Output: <p>Component function provider: component-function-value</p> */}
    </>
  )
}
```

### Example 4: SSR with Context

```tsx
import { renderToString, createContext, useContext } from 'woby'

const ThemeContext = createContext('light')

const ServerComponent = () => {
  const theme = useContext(ThemeContext)
  return <div class={`theme-${theme}`}>Server rendered</div>
}

const App = () => (
  <ThemeContext.Provider value="dark">
    <ServerComponent />
  </ThemeContext.Provider>
)

// Server-side rendering
const html = renderToString(<App />)
// Output: <div class="theme-dark">Server rendered</div>
```

## Migration Guide

### From Previous Versions

If you were relying on Context.Provider rendering as a DOM node, you need to add `visible={true}`:

**Before:**
```tsx
<ThemeContext.Provider value="dark">
  <Child />
</ThemeContext.Provider>
// Previously rendered: <context-provider value="dark">...</context-provider>
```

**After:**
```tsx
<ThemeContext.Provider value="dark" visible={true}>
  <Child />
</ThemeContext.Provider>
// Now renders: <context-provider value="dark">...</context-provider>
```

### No Breaking Changes

For most users, these changes are backwards compatible:
- Existing JSX code continues to work (providers become invisible by default)
- Custom element usage remains unchanged
- The `visible` prop is optional and defaults to `false`

## Best Practices

1. **Use Invisible Providers by Default**: Maintain React-like behavior for easier migration
2. **Use `visible={true}` for Debugging**: Temporarily enable during development
3. **Use `isStatic={true}` for Performance**: When context values don't need reactivity
4. **Multiple Siblings**: Wrap multiple sibling components in a single provider
5. **Nested Providers**: Override context values at different tree levels
6. **SSR Compatibility**: Context works seamlessly with `renderToString`

## API Reference

### Context.Provider Props

```typescript
interface ContextProviderProps {
  value: ObservableMaybe<T>        // The context value to provide
  children?: ObservableMaybe<Child> // Child components
  visible?: boolean                 // Render as DOM node (default: false)
  isStatic?: boolean                // Treat value as non-observable (default: false)
}
```

### Usage Patterns

```tsx
// Basic invisible provider
<Context.Provider value={value}>
  <Child />
</Context.Provider>

// Visible provider (renders DOM node)
<Context.Provider value={value} visible={true}>
  <Child />
</Context.Provider>

// Static value (no reactivity)
<Context.Provider value="static" isStatic={true}>
  <Child />
</Context.Provider>

// Observable value (reactive)
<Context.Provider value={$('dynamic')} isStatic={false}>
  <Child />
</Context.Provider>
```

## Testing

### Client-side Testing

```tsx
import { assert } from './util'

const expected = '<p data-test="test">value</p>'
const actual = getHTML()

assert(actual === expected, `Expected ${expected}, got ${actual}`)
```

### Server-side Rendering Tests

```tsx
import { renderToString } from 'woby'

const ssrResult = renderToString(<App />)
const expectedFull = '<h3>Title</h3><p>Content</p>'

assert(ssrResult === expectedFull, `SSR mismatch`)
```

## Related Documentation

- [Context API Main Documentation](./CONTEXT_API.md)
- [Context API Quick Reference](./CONTEXT_API_QUICK_REFERENCE.md)
- [Context API Examples](./CONTEXT_API_EXAMPLES.md)
- [Hooks Documentation](./Hooks.md)
