# Hooks

Woby provides a comprehensive set of hooks for common patterns and utilities. All hooks are just regular functions that can be called conditionally, nested, or used outside components.

## Table of Contents

- [State Hooks](#state-hooks)
- [Effect Hooks](#effect-hooks)
- [Resource Hooks](#resource-hooks)
- [Timer Hooks](#timer-hooks)
- [Utility Hooks](#utility-hooks)
- [DOM Hooks](#dom-hooks)

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
  const doubled = useMemo(() => count() * 2)
  
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

In Woby, you typically don't need to memoize event handlers because the framework's automatic dependency tracking handles optimization for you:

```typescript
// ❌ Over-engineered - Trying to replicate React patterns
const handleClick = useMemo(() => {
  return (e) => {
    console.log('Button clicked')
  }
})

// ✅ Simple and clean - Woby's automatic tracking handles optimization
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
      {isVisible() && <p>I'm visible!</p>}
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
    console.log('Count changed:', count())
    
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
    () => name(),
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
    const response = await fetch(`/api/users/${userId()}`)
    return response.json()
  })
  
  return (
    <div>
      {user.loading() && <p>Loading...</p>}
      {user.error() && <p>Error: {user.error().message}</p>}
      {user() && <p>Hello, {user().name}!</p>}
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
      {posts.loading() && <div>Loading posts...</div>}
      {posts.error() && <div>Failed to load posts</div>}
      {posts() && (
        <ul>
          {posts().map(post => (
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
      {result.loading() && <p>Loading...</p>}
      {result() && <p>Data: {result()}</p>}
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
  
  return <div>Current time: {time().toLocaleTimeString()}</div>
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
    position(p => p + 1)
  })
  
  return (
    <div style={{ transform: `translateX(${position()}px)` }}>
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
      transform: `rotate(${rotation()}rad)`,
      transition: 'none'
    }}>
      🎨
    </div>
  )
}
```

## Utility Hooks

### useContext

Consumes a context value.

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
    <div class={`theme-${theme()}`}>
      Current theme: {theme}
    </div>
  )
}
```

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
      if (!disposed()) {
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
    const doubled = $(() => count() * 2)
    
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
      count(c => c + 1)
    }
  })
  
  return (
    <div>
      <p>Count: {count}</p>
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
      count(c => c + 1)
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
    return user()?.permissions || []
  })
  
  return { permissions }
}
```

For more advanced patterns and examples, see our [Best Practices](./Best-Practices.md) guide.