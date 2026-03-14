# Context API

The Woby framework provides a context hook for sharing data between components:

1. **useContext**: Standard context hook for both JSX/TSX components and custom elements

## useContext (Both JSX/TSX and Custom Elements)

The `useContext` hook works in both JSX/TSX components and custom elements defined directly in HTML. It automatically handles context lookup through the DOM hierarchy.

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

// Consumer component in JSX/TSX
const ChildComponent = () => {
  const contextValue = useContext(CounterContext)
  return <div>Context value: {contextValue}</div>
}

// Consumer component in custom elements
const CustomChildElement = defaults(() => ({}), () => {
  const contextValue = useContext(CounterContext)
  return <div>Context value: {contextValue}</div>
})

customElement('custom-child-element', CustomChildElement)
```

```html
<!-- In HTML custom elements -->
<counter-context-provider value="42">
  <custom-child-element><!-- This child can access parent's context --></custom-child-element>
</counter-context-provider>
```

### How it Works

1. For JSX/TSX components, it uses the standard context provider pattern
2. For custom elements, it automatically retrieves context from parent elements using the DOM hierarchy
3. The context lookup traverses up the DOM tree to find the nearest context provider
4. No special hooks are needed - `useContext` works everywhere

### Parameters

- `Context`: The context object created with createContext

### Return Values

- Returns the context value from the nearest Provider
- Returns the default value if no Provider is found
- Returns `undefined` if no Provider is found and no default value was specified

### Example: Multiple Contexts in HTML

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

### Example: Nested Contexts in TSX

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

## Key Differences

| Feature | useContext |
|---------|------------|
| JSX/TSX Support | ✅ |
| Custom Element Support | ✅ |
| Provider Required | ✅ |
| HTML Usage | ✅ |
| Automatic Context Lookup | ✅ |

## Best Practices

1. Use `useContext` for all context needs as it now supports both JSX/TSX and custom elements
2. Always provide a default value when creating contexts
3. Use observables for context values that need to be reactive