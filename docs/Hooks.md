# Hooks

Woby provides a comprehensive set of hooks for common patterns and utilities. All hooks are just regular functions that can be called conditionally, nested, or used outside components.

## Table of Contents

- [State Hooks](#state-hooks)
- [Effect Hooks](#effect-hooks)
- [Resource Hooks](#resource-hooks)
- [Timer Hooks](#timer-hooks)
- [Utility Hooks](#utility-hooks)
- [DOM Hooks](#dom-hooks)
- [Context Hooks](#context-hooks)

## State Hooks

### useMemo

Creates a memoized computed value that only updates when dependencies change.

**Signature:**
```typescript
function useMemo<T>(fn: () => T): Observable<T>
```

**Usage:**
```typescript
import { $, useMemo } from 'woby'

const Component = () => {
  const count = $(0)
  const doubled = useMemo(() => $$(count) * 2)
  
  return (
    <div>
      <p>Count: {count}</p>
      <p>Doubled: {doubled}</p>
      <button onClick={() => count(c => c + 1)}>+</button>
    </div>
  )
}
```

**Best Practices:**

In Woby, event handlers are automatically optimized by the framework's dependency tracking system, eliminating the need for manual memoization:

```typescript
// ❌ Over-engineered - Attempting to replicate React patterns
const handleClick = useMemo(() => {
  return (e) => {
    console.log('Button clicked')
  }
})

// ✅ Clean and efficient - Woby's automatic tracking handles optimization
const handleClick = (e) => {
  console.log('Button clicked')
}
```

### useBoolean

Provides utilities for boolean state management.

**Signature:**
```typescript
function useBoolean(initial?: boolean): [
  Observable<boolean>,
  () => void,    // toggle
  () => void,    // setTrue
  () => void     // setFalse
]
```

**Usage:**
```typescript
import { useBoolean } from 'woby'

const Component = () => {
  const [isVisible, toggle, show, hide] = useBoolean(false)
  
  return (
    <div>
      <button onClick={toggle}>Toggle</button>
      <button onClick={show}>Show</button>
      <button onClick={hide}>Hide</button>
      {() =< $$(isVisible) && <p>I'm visible!</p>}
    </div>
  )
}
```

### useReadonly

Creates a readonly version of an observable.

**Signature:**
```typescript
function useReadonly<T>(observable: Observable<T>): ObservableReadonly<T>
```

**Usage:**
```typescript
import { $, useReadonly } from 'woby'

const Component = () => {
  const count = $(0)
  const readonlyCount = useReadonly(count)
  
  // readonlyCount() works
  // readonlyCount(5) // TypeScript error!
  
  return <div>Count: {readonlyCount}</div>
}
```

## Effect Hooks

### useEffect

Runs side effects in response to observable changes.

**Signature:**
```typescript
function useEffect(fn: () => void | (() => void)): void
```

**Usage:**
```typescript
import { $, useEffect } from 'woby'

const Component = () => {
  const count = $(0)
  
  useEffect(() => {
    console.log('Count changed:', $$(count))
    
    // Optional cleanup function
    return () => {
      console.log('Cleaning up effect')
    }
  })
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => count(c => c + 1)}>+</button>
    </div>
  )
}
```

React behavior (for comparison):
```typescript
import { useEffect } from 'react'

function Component() {
  useEffect(() => {
    console.log('Component mounted or updated')
    
    return () => {
      console.log('Component will unmount')
    }
  }, []) // Dependency array controls when effect runs
  
  return <div>Hello World</div>
}
```

Woby behavior:
```typescript
import { useEffect } from 'woby'

function Component() {
  useEffect(() => {
    console.log('Component mounted or updated')
    
    return () => {
      console.log('Component will unmount')
    }
  }) // No dependency array needed
  
  return <div>Hello World</div>
}
```

**Automatic Dependency Tracking:**
Unlike React's useEffect which requires a dependency array, Woby's useEffect automatically tracks which observables are accessed within its callback:

```typescript
import { $, $$, useEffect } from 'woby'

const userId = $(123)
const theme = $('dark')

// Woby automatically tracks userId and theme
useEffect(() => {
  console.log(`User: ${$$(userId)}, Theme: ${$$(theme)}`)
  // This effect will re-run whenever userId or theme changes
})

// No dependency array needed - Woby handles tracking automatically
```

**Reactive Content in Components:**

In Woby, components execute once but reactive content updates automatically. There are several patterns for creating reactive content:

```typescript
const ReactiveContentComponent = () => {
  const userName = $('John')
  const show = $(true)
  const valid = $(true)
  
  // ✅ Direct observable passing - simplest and most common (only 1 child)
  return <div>{userName}</div>
  
  // ✅ Function expressions - for more complex reactive expressions
  return <div>Hello {() => $$(userName)}</div>
  
  // ✅ Memoized expressions - for expensive computations (often unnecessary)
  return <div>Hello {useMemo(() => $$(userName))}</div>
  
  // ✅ Reactive attributes
  return <input disabled={valid} /> // Direct observable - reactive
  
  // ✅ Complex reactive class expressions
  return <div class={['w-full', () => $$(show) ? '' : 'hidden']}>Content</div>
}
```

**Important Notes:**
- Components execute once on mount, not on every render like React
- Reactive content updates automatically when observables change
- Direct observable passing (`{userName}`) is preferred for simple cases with only one child
- Function expressions (`{() => $$(userName)}`) are automatically tracked
- `useMemo` is unnecessary for simple expressions since `() =>` is automatically tracked
- Avoid `{$$()}` patterns as they only execute once and are not reactive

**Effect Organization:**
Separate unrelated concerns into individual effects for better performance:

```typescript
import { $, $$, useEffect } from 'woby'

const name = $('John')
const count = $(0)

// ✅ Recommended - Separate effects for different concerns
useEffect(() => {
  console.log('Name changed:', $$(name))
})

useEffect(() => {
  console.log('Count changed:', $$(count))
})

// ❌ Not recommended - Single effect with unrelated dependencies
// useEffect(() => {
//   console.log('Name:', $$(name))
//   console.log('Count:', $$(count))
// })
```

**Optimization with Early Returns:**
Use early returns to skip unnecessary work:

```typescript
import { $, $$, useEffect } from 'woby'

const name = $('John')
const previousName = $('John')

useEffect(() => {
  // Skip if name hasn't changed meaningfully
  if ($$(previousName) === $$(name)) return
  
  previousName($$(name))
  performExpensiveOperation($$(name))
})
```

### useReaction

Creates a reaction that runs when dependencies change.

**Signature:**
```typescript
function useReaction<T>(
  tracking: () => T,
  reaction: (value: T, prev: T) => void
): void
```

**Usage:**
```typescript
import { $, useReaction } from 'woby'

const Component = () => {
  const name = $('John')
  
  useReaction(
    () => $$(name),
    (newName, oldName) => {
      console.log(`Name changed from ${oldName} to ${newName}`)
    }
  )
  
  return (
    <input
      value={name}
      onInput={(e) => name(e.target.value)}
    />
  )
}
```

### useCleanup

Registers a cleanup function to run when the component unmounts.

**Signature:**
```typescript
function useCleanup(fn: () => void): void
```

**Usage:**
```typescript
import { useCleanup } from 'woby'

const Component = () => {
  const interval = setInterval(() => {
    console.log('tick')
  }, 1000)
  
  useCleanup(() => {
    clearInterval(interval)
  })
  
  return <div>Check console for ticks</div>
}
```

## Resource Hooks

### useResource

Creates a resource that can be loaded asynchronously.

**Signature:**
```typescript
function useResource<T>(
  fetcher: () => Promise<T>,
  initialValue?: T
): Resource<T>
```

**Usage:**
```typescript
import { $, useResource } from 'woby'

const UserProfile = () => {
  const userId = $(1)
  
  const user = useResource(async () => {
    const response = await fetch(`/api/users/${$$(userId)}`)
    return response.json()
  })
  
  return (
    <div>
      {$$(user.loading) && <p>Loading...</p>}
      {$$(user.error) && <p>Error: {$$(user.error).message}</p>}
      {$$(user) && <p>Hello, {$$(user).name}!</p>}
    </div>
  )
}
```

### useFetch

Simplified fetch hook for common HTTP requests.

**Signature:**
```typescript
function useFetch<T>(
  url: ObservableMaybe<string>,
  options?: RequestInit
): Resource<T>
```

**Usage:**
```typescript
import { $, useFetch } from 'woby'

const PostList = () => {
  const posts = useFetch<Post[]>('/api/posts')
  
  return (
    <div>
      {$$(posts.loading) && <div>Loading posts...</div>}
      {$$(posts.error) && <div>Failed to load posts</div>}
      {$$(posts) && (
        <ul>
          {$$(posts).map(post => (
            <li key={post.id}>{post.title}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
```

### usePromise

Wraps a promise in a resource-like interface.

**Signature:**
```typescript
function usePromise<T>(
  promise: ObservableMaybe<Promise<T>>
): Resource<T>
```

**Usage:**
```typescript
import { $, usePromise } from 'woby'

const Component = () => {
  const promise = $<Promise<string>>()
  const result = usePromise(promise)
  
  const loadData = () => {
    promise(fetch('/api/data').then(r => r.text()))
  }
  
  return (
    <div>
      <button onClick={loadData}>Load Data</button>
      {$$(result.loading) && <p>Loading...</p>}
      {$$(result) && <p>Data: {$$(result)}</p>}
    </div>
  )
}
```

## Timer Hooks

### useTimeout

Executes a function after a specified delay.

**Signature:**
```typescript
function useTimeout(
  fn: () => void,
  delay: ObservableMaybe<number>
): void
```

**Usage:**
```typescript
import { $, useTimeout } from 'woby'

const Component = () => {
  const message = $('')
  
  useTimeout(() => {
    message('Hello after 2 seconds!')
  }, 2000)
  
  return <div>{message}</div>
}
```

### useInterval

Executes a function repeatedly at specified intervals.

**Signature:**
```typescript
function useInterval(
  fn: () => void,
  delay: ObservableMaybe<number>
): void
```

**Usage:**
```typescript
import { $, useInterval } from 'woby'

const Clock = () => {
  const time = $(new Date())
  
  useInterval(() => {
    time(new Date())
  }, 1000)
  
  return <div>Current time: {() => $$(time).toLocaleTimeString()}</div>
}
```

### useAnimationFrame

Executes a function on the next animation frame.

**Signature:**
```typescript
function useAnimationFrame(fn: () => void): void
```

**Usage:**
```typescript
import { $, useAnimationFrame } from 'woby'

const AnimatedComponent = () => {
  const position = $(0)
  
  useAnimationFrame(() => {
    position(p => $$(p) + 1)
  })
  
  return (
    <div style={{ transform: `translateX(${$$(position)}px)` }}>
      Moving element
    </div>
  )
}
```

### useAnimationLoop

Creates a continuous animation loop.

**Signature:**
```typescript
function useAnimationLoop(fn: (time: number) => void): void
```

**Usage:**
```typescript
import { $, useAnimationLoop } from 'woby'

const AnimationDemo = () => {
  const rotation = $(0)
  
  useAnimationLoop((time) => {
    rotation(time * 0.001) // Convert to seconds
  })
  
  return (
    <div style={{ 
      transform: `rotate(${$$(rotation)}rad)`,
      transition: 'none'
    }}>
      🎨
    </div>
  )
}
```

## Utility Hooks

### useContext

Consumes a context value in JSX/TSX components only.

**Signature:**
```typescript
function useContext<T>(context: Context<T>): T
```

**Usage:**
```typescript
import { createContext, useContext } from 'woby'

const ThemeContext = createContext<'light' | 'dark'>('light')

const ThemedComponent = () => {
  const theme = useContext(ThemeContext)
  
  return (
    <div class={`theme-${$$(theme)}`}>
      Current theme: {theme}
    </div>
  )
}
```

**Limitations:**
- Only works in JSX/TSX components
- Requires explicit Provider components
- Does not work with custom elements defined directly in HTML

### useMountedContext

Consumes a context value in both JSX/TSX components and custom elements defined in HTML.

**Signature:**
```typescript
function useMountedContext<T, E extends HTMLElement>(Context: ContextWithDefault<E>): { ref: Observable<E>, context: ObservableReadonly<T> }
function useMountedContext<T, E extends HTMLElement>(Context: ContextWithDefault<E>, ref: Observable<E>): ObservableReadonly<T>
```

**Usage:**
```typescript
import { createContext, useMountedContext } from 'woby'

const CounterContext = createContext<number>(0)

// In JSX/TSX components
const MyComponent = () => {
  const { ref, context } = useMountedContext(CounterContext)
  return <div ref={ref}>Context value: {context}</div>
}
```

```html
<!-- In HTML custom elements -->
<counter-element>
  <counter-element><!-- This child can access parent's context --></counter-element>
</counter-element>
```

**Key Differences:**

| Feature | useContext | useMountedContext |
|---------|------------|-------------------|
| JSX/TSX Support | ✅ | ✅ |
| Custom Element Support | ❌ | ✅ |
| Provider Required | ✅ | ❌ (for custom elements) |
| Ref Integration | ❌ | ✅ |
| HTML Usage | ❌ | ✅ |

**Best Practices:**
- Use `useContext` when working exclusively with JSX/TSX components
- Use `useMountedContext` when you need to support both JSX/TSX and custom elements
- Always provide a default value when creating contexts
- Use observables for context values that need to be reactive

### useDisposed

Checks if the current component has been disposed.

**Signature:**
```typescript
function useDisposed(): Observable<boolean>
```

**Usage:**
```typescript
import { useDisposed, useEffect } from 'woby'

const Component = () => {
  const disposed = useDisposed()
  
  useEffect(() => {
    const timer = setInterval(() => {
      if (!$$(disposed)) {
        console.log('Component is still alive')
      }
    }, 1000)
    
    return () => clearInterval(timer)
  })
  
  return <div>Check console</div>
}
```

### useRoot

Creates a new reactive root for isolation.

**Signature:**
```typescript
function useRoot<T>(fn: () => T): T
```

**Usage:**
```typescript
import { $, useRoot } from 'woby'

const Component = () => {
  const result = useRoot(() => {
    const count = $(0)
    const doubled = $(() => $$(count) * 2)
    
    return { count, doubled }
  })
  
  return (
    <div>
      <p>Count: {result.count}</p>
      <p>Doubled: {result.doubled}</p>
    </div>
  )
}
```

## DOM Hooks

### useEventListener

Adds event listeners to DOM elements or the window.

**Signature:**
```typescript
function useEventListener<T extends keyof WindowEventMap>(
  target: EventTarget | (() => EventTarget),
  type: T,
  handler: (event: WindowEventMap[T]) => void,
  options?: AddEventListenerOptions
): void
```

**Usage:**
```typescript
import { $, useEventListener } from 'woby'

const Component = () => {
  const count = $(0)
  
  useEventListener(window, 'keydown', (e) => {
    if (e.key === ' ') {
      count(c => $$(c) + 1)
    }
  })
  
  return (
    <div>
      <p>Count: {() => $$(count)}</p>
      <p>Press spacebar to increment</p>
    </div>
  )
}
```

### useIdleCallback

Executes a function during idle time.

**Signature:**
```typescript
function useIdleCallback(
  fn: () => void,
  options?: IdleRequestOptions
): void
```

**Usage:**
```typescript
import { useIdleCallback } from 'woby'

const Component = () => {
  useIdleCallback(() => {
    console.log('Browser is idle, doing background work')
  })
  
  return <div>Component with background processing</div>
}
```

### useMicrotask

Executes a function in the next microtask.

**Signature:**
```typescript
function useMicrotask(fn: () => void): void
```

**Usage:**
```typescript
import { $, useMicrotask } from 'woby'

const Component = () => {
  const message = $('')
  
  useMicrotask(() => {
    message('Updated in microtask')
  })
  
  return <div>{message}</div>
}
```

## Advanced Patterns

### Conditional Hooks

Since hooks are just functions, you can call them conditionally:

```typescript
const Component = ({ useSpecialFeature }: { useSpecialFeature: boolean }) => {
  const count = $(0)
  
  if (useSpecialFeature) {
    useInterval(() => {
      count(c => $$(c) + 1)
    }, 1000)
  }
  
  return <div>Count: {count}</div>
}
```

### Custom Hooks

Create your own hooks by combining existing ones:

```typescript
function useCounter(initial = 0) {
  const count = $(initial)
  const increment = () => count(c => c + 1)
  const decrement = () => count(c => c - 1)
  const reset = () => count(initial)
  
  return { count, increment, decrement, reset }
}

const CounterComponent = () => {
  const { count, increment, decrement, reset } = useCounter(10)
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={reset}>Reset</button>
    </div>
  )
}
```

### Nested Hooks

Hooks can be nested and called from anywhere:

```typescript
function useAuth() {
  const user = $<User | null>(null)
  
  const login = useCallback(async (credentials) => {
    const userData = await api.login(credentials)
    user(userData)
  })
  
  return { user, login }
}

function usePermissions() {
  const { user } = useAuth()
  const permissions = useMemo(() => {
    return $$(user)?.permissions || []
  })
  
  return { permissions }
}
```

For more advanced patterns and examples, see our [Best Practices](./Best-Practices.md) guide.