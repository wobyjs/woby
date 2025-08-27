# Core Methods

This page documents all the core methods available in Woby. These are the fundamental building blocks for creating reactive applications.

## Table of Contents

- [Observable Creation](#observable-creation)
- [Rendering](#rendering)
- [Reactivity Control](#reactivity-control)
- [Context](#context)
- [Utilities](#utilities)

## Observable Creation

### $

Creates an observable value that can be tracked and updated reactively.

**Signature:**
```typescript
function $ <T> (): Observable<T | undefined>
function $ <T> ( value: undefined, options?: ObservableOptions<T | undefined> ): Observable<T | undefined>
function $ <T> ( value: T, options?: ObservableOptions<T> ): Observable<T>
```

**Usage:**
```typescript
import { $ } from 'woby'

// Create empty observable
const count = $<number>()

// Create with initial value
const name = $('John')

// Create with custom equality function
const user = $({ id: 1, name: 'John' }, {
  equals: (a, b) => a.id === b.id
})

// Get value
console.log(name()) // 'John'

// Set value
name('Jane')

// Update with function
count(prev => (prev || 0) + 1)
```

**Options:**
- `equals`: Custom equality function to determine when to notify subscribers
- `equals: false`: Always notify on setter calls

### store

Creates a reactive store for complex state management.

**Signature:**
```typescript
function store<T>(value: T, options?: StoreOptions): Store<T>
```

**Usage:**
```typescript
import { store } from 'woby'

const userStore = store({
  name: 'John',
  age: 30,
  settings: {
    theme: 'dark'
  }
})

// Read nested values
console.log(userStore.name()) // 'John'
console.log(userStore.settings.theme()) // 'dark'

// Update nested values
userStore.settings.theme('light')
userStore.age(31)
```

## Rendering

### render

Renders a component tree into a DOM element.

**Signature:**
```typescript
function render(element: JSX.Element, container: Element): () => void
```

**Usage:**
```typescript
import { render } from 'woby'

const App = () => <div>Hello World</div>

// Render and get cleanup function
const cleanup = render(<App />, document.getElementById('app'))

// Later, clean up
cleanup()
```

### renderToString

Renders a component tree to an HTML string (for SSR).

**Signature:**
```typescript
function renderToString(element: JSX.Element): string
```

**Usage:**
```typescript
import { renderToString } from 'woby'

const App = () => <div>Hello World</div>

const html = renderToString(<App />)
console.log(html) // '<div>Hello World</div>'
```

## Reactivity Control

### batch

Batches multiple updates to prevent unnecessary re-renders.

**Signature:**
```typescript
function batch<T>(fn: () => T): T
```

**Usage:**
```typescript
import { batch } from 'woby'

const name = $('John')
const age = $(30)

// Without batch: triggers 2 updates
name('Jane')
age(31)

// With batch: triggers 1 update
batch(() => {
  name('Jane')
  age(31)
})
```

### untrack

Runs a function without tracking its observable dependencies.

**Signature:**
```typescript
function untrack<T>(fn: () => T): T
```

**Usage:**
```typescript
import { untrack } from 'woby'

const count = $(0)
const double = $(() => {
  const current = count()
  
  // This won't create a dependency on count
  const untracked = untrack(() => count())
  
  return current * 2
})
```

### isBatching

Checks if code is currently running inside a batch.

**Signature:**
```typescript
function isBatching(): boolean
```

**Usage:**
```typescript
import { isBatching } from 'woby'

console.log(isBatching()) // false

batch(() => {
  console.log(isBatching()) // true
})
```

## Context

### createContext

Creates a context for passing data through the component tree.

**Signature:**
```typescript
function createContext<T>(defaultValue?: T): Context<T>
```

**Usage:**
```typescript
import { createContext } from 'woby'

interface User {
  name: string
  role: string
}

const UserContext = createContext<User>()

// Provide context value
const App = () => (
  <UserContext.Provider value={{ name: 'John', role: 'admin' }}>
    <UserProfile />
  </UserContext.Provider>
)
```

## Utilities

### lazy

Creates a lazily-loaded component.

**Signature:**
```typescript
function lazy<T>(loader: () => Promise<{ default: T }>): T
```

**Usage:**
```typescript
import { lazy, Suspense } from 'woby'

const LazyComponent = lazy(() => import('./HeavyComponent'))

const App = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <LazyComponent />
  </Suspense>
)
```

### resolve

Resolves a potentially observable value.

**Signature:**
```typescript
function resolve<T>(value: ObservableMaybe<T>): T
```

**Usage:**
```typescript
import { resolve } from 'woby'

const getValue = (input: string | Observable<string>) => {
  const resolved = resolve(input)
  return resolved.toUpperCase()
}

getValue('hello') // 'HELLO'
getValue($('hello')) // 'HELLO'
```

### isObservable

Checks if a value is an observable.

**Signature:**
```typescript
function isObservable(value: unknown): value is Observable<unknown>
```

**Usage:**
```typescript
import { isObservable } from 'woby'

const name = $('John')
const regular = 'Jane'

console.log(isObservable(name)) // true
console.log(isObservable(regular)) // false
```

### isStore

Checks if a value is a store.

**Signature:**
```typescript
function isStore(value: unknown): value is Store<unknown>
```

**Usage:**
```typescript
import { isStore } from 'woby'

const user = store({ name: 'John' })
const obs = $('value')

console.log(isStore(user)) // true
console.log(isStore(obs)) // false
```

### isServer

Checks if code is running on the server (for SSR).

**Signature:**
```typescript
function isServer(): boolean
```

**Usage:**
```typescript
import { isServer } from 'woby'

const Component = () => {
  if (isServer()) {
    return <div>Server-side content</div>
  }
  
  return <div>Client-side content</div>
}
```

## Type Utilities

### `Observable<T>`

Type for observable values.

```typescript
type Observable<T> = {
  (): T
  (value: T): T
  (updater: (prev: T) => T): T
}
```

### `ObservableMaybe<T>`

Type for values that may or may not be observable.

```typescript
type ObservableMaybe<T> = T | Observable<T>
```

### `FunctionMaybe<T>`

Type for values that may be functions.

```typescript
type FunctionMaybe<T> = T | (() => T)
```

## Advanced Usage

### Custom Equality

```typescript
const user = $({ id: 1, name: 'John' }, {
  equals: (a, b) => a.id === b.id && a.name === b.name
})
```

### Always Update

```typescript
const timestamp = $(Date.now(), { equals: false })
// Always triggers updates even with same value
```

### Derived Observables

```typescript
const firstName = $('John')
const lastName = $('Doe')
const fullName = $(() => `${firstName()} ${lastName()}`)
```

For more examples and advanced patterns, see our [Examples](./Examples.md) page.