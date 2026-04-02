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