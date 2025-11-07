# Context API Documentation

The Context API in Woby provides a way to pass data through the component tree without having to pass props down manually at every level. It's especially useful for global data like themes, user authentication, or preferred language.

## Table of Contents

- [createContext](#createcontext)
- [useContext](#usecontext)
- [useMountedContext](#usemountedcontext)
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
```

## useContext

Accesses the current value of a context within a functional component.

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
const ThemeContext = createContext('light')

const ThemedButton = () => {
  const theme = useContext(ThemeContext)
  return <button className={`theme-${theme}`}>Click me</button>
}
```

## useMountedContext

A specialized hook that provides context values for components with special support for custom elements. This hook works in both JSX/TSX components and custom elements defined in HTML.

### Syntax

```typescript
// Without ref parameter (returns [context, mount])
const [context, mount] = useMountedContext(Context)

// With existing ref parameter (returns only context)
const context = useMountedContext(Context, ref)
```

### Parameters

- `Context`: The context object created by `createContext`
- `ref` (optional): An existing observable ref to use

### Returns

- When called without `ref`: A tuple containing the context value and a mounting placeholder comment element
- When called with `ref`: Only the context value

### Example

```tsx
// Usage in custom elements (returns [context, mounting placeholder])
const CounterContext = createContext<number>(0)
const [context, mount] = useMountedContext(CounterContext)

return <div>{mount}Context value: {context}</div>

// Usage with existing ref (returns only context)
const myRef = $<HTMLDivElement>()
const context = useMountedContext(CounterContext, myRef)

return <div ref={myRef}>Context value: {context}</div>
```

## Custom Element Context Support

Custom elements created with Woby's `customElement` function have special support for context. The context value is stored on the first child node of the parent element and can be accessed by child custom elements.

### How it works

1. When a context Provider is used, the context value is stored on the first child node of the parent element
2. Child custom elements can access this context value using `useMountedContext`
3. The context lookup traverses up the DOM tree to find the nearest context provider

### Example

```tsx
// Create a context
const ValueContext = createContext(0)

// Create a custom element that uses context
const ValueDisplay = defaults(() => ({}), () => {
  const [context, mount] = useMountedContext(ValueContext)
  return <div>{mount}Value: {context}</div>
})

customElement('value-display', ValueDisplay)

// Usage in HTML:
// <value-context-provider value="42">
//   <value-display></value-display>
// </value-context-provider>
```

### Context in Shadow DOM

For custom elements using Shadow DOM, the context lookup traverses through shadow boundaries and slots to find the nearest context provider in the light DOM.