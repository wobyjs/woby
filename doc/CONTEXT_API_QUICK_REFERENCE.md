# Context API Quick Reference

## TL;DR

**Use `useContext` everywhere - it works in both JSX/TSX components and custom elements!**

```typescript
const value = useContext(MyContext)
```

## Basic Pattern

### Create Context
```typescript
import { createContext } from 'woby'
const MyContext = createContext('default-value')
```

### Provide Context
```typescript
<MyContext.Provider value={someValue}>
  <ChildComponent />
</MyContext.Provider>
```

### Consume Context
```typescript
// In JSX/TSX components
const MyComponent = () => {
  const value = useContext(MyContext)
  return <div>{value}</div>
}

// In custom elements
const MyElement = defaults(() => ({}), () => {
  const value = useContext(MyContext)
  return <div>{value}</div>
})
customElement('my-element', MyElement)
```

## Common Patterns

### Pattern 1: Multiple Contexts
```typescript
const ThemeContext = createContext('light')
const UserContext = createContext({ name: 'Anonymous' })

const MultiContextElement = defaults(() => ({}), () => {
  const theme = useContext(ThemeContext)
  const user = useContext(UserContext)
  
  return (
    <div>
      <p>Theme: {theme}</p>
      <p>User: {user.name}</p>
    </div>
  )
})
```

### Pattern 2: Nested Contexts
```typescript
<Context.Provider value="outer">
  <Reader />
  <Context.Provider value="inner">
    <Reader />
  </Context.Provider>
  <Reader />
</Context.Provider>
```

### Pattern 3: Reactive Context Values
```typescript
const appTheme = $('dark')
const appCounter = $(100)

return (
  <ThemeContext.Provider value={appTheme}>
    <CounterContext.Provider value={appCounter}>
      <ChildComponent />
    </CounterContext.Provider>
  </ThemeContext.Provider>
)
```

### Pattern 4: Context in HTML
```typescript
const ReaderContext = createContext<string>('')
const OtherContext = createContext<string>('')

customElement('reader-context', ReaderContext.Provider)
customElement('other-context', OtherContext.Provider)

const Reader = defaults(() => ({}), () => {
  const ctx = useContext(readerContext)
  const oth = useContext(otherContext)
  return <p>{ctx} other: {oth}</p>
})

customElement('test-reader', Reader)

// Usage in HTML
return () => (
  <div dangerouslySetInnerHTML={{
    __html: `
      <other-context value="123">
        <reader-context value="outer">
          <test-reader></test-reader>
        </reader-context>
      </other-context>
    `}}
  />
)
```

### Pattern 5: Function Children
```typescript
{() => jsx(Context.Provider, {
  value: "function-value",
  children: () => {
    const value = useContext(Context)
    return <p>Function provider: {value}</p>
  }
})}
```

## Migration Checklist

**Note:** This migration has been completed. Checklist kept for historical reference.

## API Comparison

**Historical reference:** The old API using `useMountedContext` has been deprecated and removed.

## Examples by Use Case

### Theme Switching
```typescript
const ThemeContext = createContext('light')

const ThemedButton = () => {
  const theme = useContext(ThemeContext)
  return <button className={`btn-${theme}`}>Click me</button>
}
```

### User Authentication
```typescript
const AuthContext = createContext<{ user: string, token: string } | null>(null)

const UserProfile = () => {
  const auth = useContext(AuthContext)
  if (!auth) return <div>Please login</div>
  return <div>Welcome, {auth.user}!</div>
}
```

### Language Preference
```typescript
const LanguageContext = createContext('en')

const LocalizedText = ({ en, es }: { en: string, es: string }) => {
  const lang = useContext(LanguageContext)
  return <span>{lang === 'en' ? en : es}</span>
}
```

### Counter with Shared State
```typescript
const CounterContext = createContext(0)

const CounterDisplay = () => {
  const count = useContext(CounterContext)
  return <p>Count: {count}</p>
}

const CounterProvider = ({ children }) => {
  const count = $(0)
  return (
    <CounterContext.Provider value={count}>
      {children}
    </CounterContext.Provider>
  )
}
```

## Troubleshooting

### Context is undefined
✅ **Solution**: Make sure you're using a Provider above the consumer

```typescript
// ❌ Wrong - No provider
const value = useContext(MyContext)

// ✅ Right - With provider
<MyContext.Provider value="something">
  <ChildComponent />
</MyContext.Provider>
```

### Context not updating
✅ **Solution**: Use observables for reactive context values

```typescript
// ❌ Static value
const theme = $('light')

// ✅ Reactive value
const theme = $('light')
<ThemeContext.Provider value={theme}>
```

### Works in TSX but not in HTML
✅ **Solution**: `useContext` works the same everywhere now

```typescript
// Both work with useContext
const Component = () => useContext(MyContext)
const Element = defaults(() => ({}), () => useContext(MyContext))
```

## See Also

- [Full Context API Documentation](./CONTEXT_API.md)
- [Context API Examples](./CONTEXT_API_EXAMPLES.md)
- [Deprecation Notice](./DEPRECATION_useMountedContext_useAttached.md)
- [Custom Elements Guide](./CUSTOM_ELEMENTS.md)
