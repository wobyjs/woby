# FAQ

Frequently asked questions about the Woby framework.

## General Questions

### What is Woby?

Woby is a high-performance reactive framework with fine-grained observable-based reactivity. It's similar to Solid.js but without requiring Babel transforms and with a different API approach.

### How is Woby different from React?

- **No Virtual DOM**: Direct DOM manipulation for enhanced performance
- **No hooks rules**: Functions can be called conditionally, nested, or outside components
- **Fine-grained updates**: Only changed parts re-render, not entire components
- **Observable-based**: Uses observables/signals instead of state and props
- **No dependencies arrays**: Automatic dependency tracking

### How is Woby different from Solid.js?

- **No Babel required**: Works with plain TypeScript/JavaScript
- **Different API**: Uses `$()` for observables instead of `createSignal()`
- **Store integration**: Built-in store system from `soby`
- **JSX runtime**: Uses its own JSX runtime

### Is Woby production ready?

Woby is actively developed and used in production applications. However, as with any framework, evaluate it based on your specific needs and requirements.

## Technical Questions

### How do I handle forms in Woby?

Use observables for form state management:

```typescript
const LoginForm = () => {
  const username = $('')
  const password = $('')
  
  const handleSubmit = (e) => {
    e.preventDefault()
    console.log({ username: username(), password: password() })
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input 
        value={username}
        onInput={e => username(e.target.value)}
        placeholder="Username"
      />
      <input 
        type="password"
        value={password}
        onInput={e => password(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Login</button>
    </form>
  )
}
```

### How do I manage global state?

Use stores for global state management:

```typescript
import { store, createContext, useContext } from 'woby'

const globalStore = store({
  user: null,
  theme: 'light',
  settings: {}
})

const AppContext = createContext(globalStore)

const useGlobalState = () => useContext(AppContext)
```

### How do I handle async operations?

Use resources for asynchronous data fetching:

```typescript
import { useResource } from 'woby'

const DataComponent = () => {
  const data = useResource(async () => {
    const response = await fetch('/api/data')
    return response.json()
  })
  
  return (
    <div>
      //without arrow function, the following line become runs without reactive
      {() => $$(data.loading) && <div>Loading...</div>}
      {() => $$(data.error) && <div>Error: {$$(data.error).message}</div>}
      {() => $$(data) && <div>Data: {JSON.stringify($$(data))}</div>}
    </div>
  )
}
```

### How do I optimize performance?

1. **Use memoization** for expensive computations:
```typescript
const expensive = useMemo(() => heavyComputation(data()))
```

2. **Batch updates** when making multiple changes:
```typescript
batch(() => {
  setValue1(newValue1)
  setValue2(newValue2)
})
```

3. **Use the appropriate iteration component**:
- `For` for complex objects
- `ForValue` for primitives
- `ForIndex` for fixed-size lists

### How do I handle component lifecycle?

Use hooks for lifecycle management:

```typescript
const Component = () => {
  // On mount
  useEffect(() => {
    console.log('Component mounted')
    
    // Cleanup on unmount
    return () => {
      console.log('Component unmounted')
    }
  })
  
  return <div>Component content</div>
}
```

### How do I handle routing?

Woby does not include a built-in router, but you can implement:

1. **Simple hash-based routing**:
```typescript
const route = $(() => window.location.hash.slice(1) || 'home')

window.addEventListener('hashchange', () => {
  route(window.location.hash.slice(1) || 'home')
})

const Router = () => (
  <Switch>
    <Match when={() => route() === 'home'}>
      <HomePage />
    </Match>
    <Match when={() => route() === 'about'}>
      <AboutPage />
    </Match>
  </Switch>
)
```

2. **Third-party routers** compatible with reactive frameworks

### How do I test Woby components?

Use the testing utilities:

```typescript
import { render } from 'woby/testing'

test('counter increments', () => {
  const { container } = render(<Counter />)
  const button = container.querySelector('button')
  const display = container.querySelector('h1')
  
  expect(display.textContent).toBe('Count: 0')
  
  button.click()
  expect(display.textContent).toBe('Count: 1')
})
```

## Common Issues

### Ensuring Component Re-rendering

Verify that you are:
1. Calling the observable as a function: `count()` not `count`
2. Using the observable in a reactive context (component or effect)
3. Actually updating the observable: `count(newValue)`

### Handling "Cannot read property of undefined" Errors

This typically occurs when:
1. Accessing properties on undefined observables
2. Not properly initializing observables
3. Incorrectly unwrapping observables

Solution:
```typescript
// ❌ Incorrect
const user = $()
console.log(user().name) // Error if user() is undefined

// ✅ Correct
const user = $({ name: '' })
console.log(user().name) // Safe access

// ✅ With optional chaining
console.log(user()?.name) // Safe access with optional chaining
```

### Performance Considerations

For optimal performance:
1. Minimize unnecessary observable updates
2. Use `untrack` when reading observables without creating dependencies
3. Leverage `batch` for multiple synchronous updates
4. Use `useMemo` for expensive computations

### Debugging Reactive Updates

To debug reactive updates:
1. Use `console.log` inside effects to trace when they run
2. Utilize browser dev tools to inspect observable values
3. Add logging to track observable changes:

```typescript
<ErrorBoundary
  fallback={(error, reset) => (
    <div>
      <h2>Something went wrong</h2>
      <button onClick={reset}>Try again</button>
    </div>
  )}
>
  <App />
</ErrorBoundary>
```

## Migration Questions

### Coming from React?

See our [Migration from React](./Migration-From-React.md) guide.

### Coming from Solid?

See our [Migration from Solid](./Migration-From-Solid.md) guide.

### Can I use existing React libraries?

Most React libraries won't work directly since Woby uses a different paradigm. Look for:
1. Framework-agnostic libraries
2. Woby-specific alternatives
3. Vanilla JavaScript libraries

## Getting Help

- **GitHub Issues**: [Report bugs or request features](https://github.com/wongchichong/woby/issues)
- **Discussions**: [Community discussions](https://github.com/wongchichong/woby/discussions)
- **Examples**: [woby-demo repository](https://github.com/wongchichong/woby-demo)

Still have questions? Feel free to [open a discussion](https://github.com/wongchichong/woby/discussions) on GitHub!