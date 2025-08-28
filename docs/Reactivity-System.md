# Reactivity System

Woby's reactivity system is built on observables and provides fine-grained reactive updates. Understanding this system is key to building efficient Woby applications.

## Table of Contents

- [Observables Basics](#observables-basics)
- [Reactive Dependencies](#reactive-dependencies)
- [Stores](#stores)
- [Batching](#batching)
- [Advanced Patterns](#advanced-patterns)
- [Best Practices](#best-practices)

## Observables Basics

### What are Observables?

Observables in Woby are reactive values that automatically track their dependencies and notify subscribers when they change. They're similar to signals in other frameworks but with a simple, intuitive API.

```typescript
import { $ } from 'woby'

// Create an observable
const count = $(0)

// Read the value
console.log(count()) // 0

// Set a new value
count(1)
console.log(count()) // 1

// Update with a function
count(prev => prev + 1)
console.log(count()) // 2
```

### Observable Types

**Primitive Observables:**
```typescript
const name = $('John')
const age = $(30)
const isActive = $(true)
const items = $<string[]>([])
```

**Computed Observables:**
```typescript
const firstName = $('John')
const lastName = $('Doe')

// Automatically updates when firstName or lastName changes
const fullName = $(() => `${firstName()} ${lastName()}`)

console.log(fullName()) // "John Doe"
firstName('Jane')
console.log(fullName()) // "Jane Doe"
```

**Custom Equality:**
```typescript
const user = $({ id: 1, name: 'John' }, {
  equals: (a, b) => a.id === b.id
})

// Only triggers updates when the ID changes
user({ id: 1, name: 'Jane' }) // No update triggered
user({ id: 2, name: 'Jane' }) // Update triggered
```

## Reactive Dependencies

### Automatic Dependency Tracking

Woby automatically tracks which observables are accessed during function execution:

```typescript
const count = $(0)
const doubled = $(0)
const quadrupled = $(0)

// This creates a dependency chain
const updateChain = () => {
  doubled(count() * 2)      // Depends on count
  quadrupled(doubled() * 2) // Depends on doubled
}

// Any change to count will update the entire chain
count(5) // doubled becomes 10, quadrupled becomes 20
```

### Reactive Context

Components automatically create reactive contexts where observable access is tracked:

```typescript
const Component = () => {
  const count = $(0)
  const message = $('Hello')
  
  // This component will re-render when either count or message changes
  return (
    <div>
      <p>{message()}: {count()}</p>
      <button onClick={() => count(c => c + 1)}>+</button>
    </div>
  )
}
```

### Manual Dependency Control

**Untracking Dependencies:**
```typescript
import { untrack } from 'woby'

const count = $(0)
const other = $(0)

const computed = $(() => {
  const c = count() // This creates a dependency
  
  // This doesn't create a dependency
  const o = untrack(() => other())
  
  return c + o
})

count(1) // Triggers update
other(1) // Doesn't trigger update
```

**Conditional Dependencies:**
```typescript
const showDetails = $(false)
const name = $('John')
const details = $('Developer')

const display = $(() => {
  const n = name() // Always depends on name
  
  if (showDetails()) {
    return `${n} - ${details()}` // Conditionally depends on details
  }
  
  return n
})
```

## Stores

### Creating Stores

Stores provide reactive access to nested object properties:

```typescript
import { store } from 'woby'

const userStore = store({
  personal: {
    name: 'John',
    age: 30
  },
  preferences: {
    theme: 'dark',
    language: 'en'
  },
  todos: [
    { id: 1, text: 'Learn Woby', done: false }
  ]
})
```

### Accessing Store Properties

```typescript
// Read values
console.log(userStore.personal.name()) // 'John'
console.log(userStore.preferences.theme()) // 'dark'

// Update values
userStore.personal.name('Jane')
userStore.preferences.theme('light')

// Update nested objects
userStore.personal({
  name: 'Bob',
  age: 25
})
```

### Store Arrays

```typescript
// Add items
userStore.todos([
  ...userStore.todos(),
  { id: 2, text: 'Build app', done: false }
])
```

## Best Practices

### Use `$$()` for Unwrapping Observables

When accessing the value of an observable, prefer using `$$()` over direct invocation `()`:

```typescript
import { $, $$ } from 'woby'

// ❌ Avoid - Direct invocation
const count = $(0)
console.log(count()) // Works, but not recommended

// ✅ Prefer - Using $$ for unwrapping
const count = $(0)
console.log($$(count)) // Recommended approach

// ❌ Dangerous - Direct invocation can be ambiguous
const maybeObservable = getValue() // Could be observable or plain value
const value = maybeObservable() // If it's not observable, this will cause an error

// ✅ Safe - Using $$ handles both cases
const maybeObservable = getValue()
const value = $$(maybeObservable) // Works for both observables and plain values
```

**Why this matters:**
- `$$()` safely handles both observable and non-observable values
- `$$()` is more explicit about intent to unwrap a value
- Prevents errors when dealing with uncertain types

### Declaring Reactive Variables with `$()`

To participate in Woby's reactivity system, variables must be declared using `$()`:

```typescript
import { $, $$, useEffect, useMemo } from 'woby'

// ❌ Not reactive - plain variables don't trigger updates
let count = 0;
let name = 'John';

// ✅ Reactive - variables declared with $() are trackable
const count = $(0);
const name = $('John');

// Effects automatically track dependencies when accessed with $$()
useEffect(() => {
  console.log(`Count: ${$$(count)}, Name: ${$$(name)}`);
  // This effect will re-run whenever count or name changes
});

// Memoized computations automatically track dependencies
const doubledCount = useMemo(() => {
  return $$(count) * 2; // Tracks count
});
```

### Avoid Setting Observables to Undefined

Be careful when calling observables without parameters as this sets them to `undefined`:

```typescript
import { $, $$ } from 'woby'

const count = $(0)

// ❌ Avoid - This sets count to undefined
count() // Equivalent to count(undefined)

// ✅ Correct - Only set values explicitly
count(5) // Set to 5
console.log($$(count)) // Read the value
```

## Batching

### Automatic Batching

Woby automatically batches updates in event handlers and async operations:

```typescript
const count = $(0)
const doubled = $(() => count() * 2)

const handleClick = () => {
  count(1) // These updates are automatically batched
  count(2)
  count(3)
  // Only one re-render occurs with final value of 3
}
```

### Manual Batching

```typescript
import { batch } from 'woby'

const name = $('John')
const age = $(30)

// Without batching: triggers 2 updates
name('Jane')
age(31)

// With batching: triggers 1 update
batch(() => {
  name('Jane')
  age(31)
})
```

### Checking Batch State

```typescript
import { isBatching } from 'woby'

console.log(isBatching()) // false

batch(() => {
  console.log(isBatching()) // true
})
```

## Advanced Patterns

### Derived State

```typescript
const items = $([
  { name: 'Apple', price: 1.00, category: 'fruit' },
  { name: 'Bread', price: 2.50, category: 'bakery' },
  { name: 'Banana', price: 0.50, category: 'fruit' }
])

const filter = $('all')

const filteredItems = $(() => {
  const f = filter()
  if (f === 'all') return items()
  return items().filter(item => item.category === f)
})

const totalPrice = $(() => {
  return filteredItems().reduce((sum, item) => sum + item.price, 0)
})

const itemCount = $(() => filteredItems().length)
```

### Reactive Patterns

**Observer Pattern:**
```typescript
const eventBus = $<{ type: string, data: any } | null>(null)

// Multiple components can listen to events
const Component1 = () => {
  const message = $('')
  
  // React to events
  $(() => {
    const event = eventBus()
    if (event?.type === 'notification') {
      message(event.data.message)
    }
  })
  
  return <div>{message}</div>
}

// Emit events
const emitEvent = (type: string, data: any) => {
  eventBus({ type, data })
}
```

**State Machine Pattern:**
```typescript
const state = $<'idle' | 'loading' | 'success' | 'error'>('idle')
const data = $<any>(null)
const error = $<string | null>(null)

const fetchData = async () => {
  state('loading')
  error(null)
  
  try {
    const result = await fetch('/api/data')
    const json = await result.json()
    
    batch(() => {
      data(json)
      state('success')
    })
  } catch (err) {
    batch(() => {
      error(err.message)
      state('error')
    })
  }
}

const Component = () => (
  <div>
    <button onClick={fetchData} disabled={() => state() === 'loading'}>
      {state() === 'loading' ? 'Loading...' : 'Fetch Data'}
    </button>
    
    <If when={() => state() === 'success'}>
      <pre>{() => JSON.stringify(data(), null, 2)}</pre>
    </If>
    
    <If when={() => state() === 'error'}>
      <div>Error: {error}</div>
    </If>
  </div>
)
```

### Memory Management

**Cleanup:**
```typescript
import { useCleanup } from 'woby'

const Component = () => {
  const timer = setInterval(() => {
    console.log('tick')
  }, 1000)
  
  useCleanup(() => {
    clearInterval(timer)
  })
  
  return <div>Component with cleanup</div>
}
```

**Weak References:**
```typescript
// Use WeakMap for component-specific observables
const componentObservables = new WeakMap()

const useComponentObservable = (component, initialValue) => {
  if (!componentObservables.has(component)) {
    componentObservables.set(component, $(initialValue))
  }
  return componentObservables.get(component)
}
```

### Performance Optimization

**Memoization:**
```typescript
import { useMemo } from 'woby'

const expensiveComputation = (data) => {
  // Expensive operation
  return data.map(item => ({ ...item, processed: true }))
}

const Component = () => {
  const data = $([/* large dataset */])
  
  // Only recomputes when data changes
  const processedData = useMemo(() => expensiveComputation(data()))
  
  return <div>{processedData().length} items processed</div>
}
```

**Selective Updates:**
```typescript
const largeList = $([/* thousands of items */])

// Only update specific item instead of entire list
const updateItem = (id, updates) => {
  largeList(prev => prev.map(item => 
    item.id === id ? { ...item, ...updates } : item
  ))
}

// Or use a store for even finer granularity
const listStore = store({ items: [/* items */] })
listStore.items[5].name('Updated name') // Only updates this specific item
```

For more performance optimization techniques, see our [Performance Guide](./Performance.md).