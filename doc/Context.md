# Context API

The Woby framework provides a context hook for sharing data between components:

1. **useContext**: Standard context hook for both JSX/TSX components and custom elements

## Table of Contents

- [useContext (Both JSX/TSX and Custom Elements)](#usecontext-both-jsxtsx-and-custom-elements)
- [Creating Context](#creating-context)
- [Providing Context](#providing-context)
- [Consuming Context](#consuming-context)
- [Best Practices](#best-practices)

## useContext (Both JSX/TSX and Custom Elements)

The `useContext` hook works in both JSX/TSX components and custom elements defined directly in HTML. It provides special support for custom elements by attempting to retrieve context from parent elements.

### Usage

```tsx
import { createContext, useContext } from 'woby'

// Create a context
const CounterContext = createContext<number>(0)

// Provider component
const ParentComponent = () => {
  const value = $(42)
  
  return (
    <CounterContext.Provider value={value}>
      <ChildComponent />
    </CounterContext.Provider>
  )
}

// Consumer component
const ChildComponent = () => {
  const contextValue = useContext(CounterContext)
  return <div>Context value: {contextValue}</div>
}
```

```html
<!-- In HTML custom elements -->
<counter-element>
  <counter-element><!-- This child can access parent's context --></counter-element>
</counter-element>
```

### How it Works

1. For JSX/TSX components, it uses the standard context provider pattern
2. For custom elements, it attempts to retrieve context from the parent element's context property
3. It automatically handles the differences between the two environments

### Parameters

- `Context`: The context object created with createContext

### Return Values

- Returns the context value

## Creating Context

To create a context, use the `createContext` function:

```tsx
import { createContext } from 'woby'

// Create a context with a default value
const ThemeContext = createContext<'light' | 'dark'>('light')

// Create a context with an observable default value
const UserContext = createContext<Observable<User | null>>(null)
```

## Providing Context

You must use a Provider component:

```tsx
import { createContext } from 'woby'

const ThemeContext = createContext<'light' | 'dark'>('light')

const App = () => {
  const theme = $('dark')
  
  return (
    <ThemeContext.Provider value={theme}>
      <ThemedComponent />
    </ThemeContext.Provider>
  )
}
```

### Advanced Provider Options

#### visible Prop

By default, Context.Provider is invisible in JSX (doesn't render a DOM node). Use `visible={true}` to render it as a `<context-provider>` DOM element:

```tsx
// Invisible provider (default) - React-like behavior
<ThemeContext.Provider value={theme}>
  <ChildComponent />
</ThemeContext.Provider>

// Visible provider - renders <context-provider> DOM node
<ThemeContext.Provider value={theme} visible={true}>
  <ChildComponent />
</ThemeContext.Provider>
```

#### isStatic Prop

Control whether context values are observable or static:

```tsx
// Static context value (not reactive)
<ThemeContext.Provider value="dark" isStatic={true}>
  <ChildComponent />
</ThemeContext.Provider>

// Observable context value (reactive by default)
<ThemeContext.Provider value={theme$} isStatic={false}>
  <ChildComponent />
</ThemeContext.Provider>
```

Context is automatically propagated from parent to child custom elements.

## Consuming Context

### Consuming Context

### With useContext (Both JSX/TSX and Custom Elements)

```tsx
import { useContext } from 'woby'

const ThemedComponent = () => {
  const theme = useContext(ThemeContext)
  
  return (
    <div class={`theme-${$$(theme)}`}>
      Current theme: {theme}
    </div>
  )
}
```

### Complete Example with Nested Providers

```tsx
import { $, $$, createContext, useContext } from 'woby'

const ThemeContext = createContext<'light' | 'dark'>('light')
const UserContext = createContext<string>('anonymous')

// Multiple siblings consuming context
const Sibling1 = () => <p>First: {useContext(UserContext)}</p>
const Sibling2 = () => <p>Second: {useContext(UserContext)}</p>
const Sibling3Nested = () => <p>Nested: {useContext(UserContext)}</p>
const Sibling4 = () => <p>Last: {useContext(UserContext)}</p>

const App = () => {
  return (
    <>
      <h3>Context - Components</h3>
      <ThemeContext.Provider value="outer">
        {/* First child - function component */}
        <p>{useContext(ThemeContext)}</p>
        
        {/* Second child - regular element */}
        <span>separator</span>
        
        {/* Third child - nested provider with children at different positions */}
        <ThemeContext.Provider value="inner">
          {/* First child in nested provider */}
          <p>{useContext(ThemeContext)}</p>
          
          {/* Middle child - another nested element */}
          <div>
            <span>nested content</span>
          </div>
          
          {/* Last child in nested provider */}
          <p>{useContext(ThemeContext)}</p>
        </ThemeContext.Provider>
        
        {/* Last child - function component after nested provider */}
        <p>{useContext(ThemeContext)}</p>
      </ThemeContext.Provider>
      
      {/* Multiple siblings test */}
      <h3>Multiple Siblings Test</h3>
      <UserContext.Provider value="multi-test">
        <Sibling1 />
        <Sibling2 />
        <div>
          <Sibling3Nested />
        </div>
        <Sibling4 />
      </UserContext.Provider>
    </>
  )
}
```

## Best Practices

1. Use `useContext` for all context needs as it now supports both JSX/TSX and custom elements
2. Always provide a default value when creating contexts
3. Use observables for context values that need to be reactive
4. Avoid passing complex objects in context; prefer primitive values or observables
5. Use context sparingly - only for data that needs to be shared across many components
6. Consider using props for data that only needs to be passed down a few levels
7. Use `visible={true}` prop when you need the provider to render as a DOM node (for debugging or specific layout needs)
8. Use `isStatic={true}` for non-reactive context values to improve performance
9. Context providers can wrap multiple sibling children - all will have access to the context value