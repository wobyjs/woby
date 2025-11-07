# Reactivity System

Woby's reactivity system is built upon observables and provides fine-grained reactive updates. A comprehensive understanding of this system is essential for developing efficient Woby applications.

## Table of Contents

- [Observables Basics](#observables-basics)
- [Reactive Dependencies](#reactive-dependencies)
- [Stores](#stores)
- [Batching](#batching)
- [Enhanced Observable Functions](#enhanced-observable-functions)
- [Reactive Utilities](#reactive-utilities)
  - [Observable Creation ($)](#observable-creation-)
  - [Observable Unwrapping ($$)](#observable-unwrapping-)
  - [API Reference](#api-reference)
    - [$$ Function](#-function)
- [Advanced Patterns](#advanced-patterns)
- [Best Practices](#best-practices)
- [Effect Management](#effect-management)

## Observables Basics

### What are Observables?

Observables in Woby are reactive values that automatically track their dependencies and notify subscribers when they change. They're similar to signals in other frameworks but with a simple, intuitive API.

```typescript
import { $ } from 'woby'

// Create an observable
const count = $(0)

// Read the value
console.log($$(count)) // 0

// Set a new value
count(1)
console.log($$(count)) // 1

// Update with different syntaxes
count(count + 1)         // Direct observable reference
count($$(count) + 1)     // Using $$ unwrapping
count(c => c + 1)        // Using function updater (similar to React)
console.log(count()) // 4
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
const fullName = $(() => `${$$(firstName)} ${$$(lastName)}`)

console.log($$(fullName)) // "John Doe"
firstName('Jane')
console.log($$(fullName)) // "Jane Doe"
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
  doubled($$(count) * 2)      // Depends on count
  quadrupled($$(doubled) * 2) // Depends on doubled
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
      <p>{message}: {count}</p>
      <button onClick={() => count(count + 1)}>+</button>
    </div>
  )
}
```

**Key Points:**
- Direct observable passing (`{message}`) is the preferred pattern for simple cases with only one child
- Function expressions (`{() => $$(message)}`) are automatically tracked and suitable for complex expressions
- For attributes, you can directly pass observables for automatic reactivity (`disabled={valid}`)

### Manual Dependency Control

**Untracking Dependencies:**
```typescript
import { untrack } from 'woby'

const count = $(0)
const other = $(0)

const computed = $(() => {
  const c = $$(count) // This creates a dependency
  
  // This doesn't create a dependency
  const o = untrack(() => $$(other))
  
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
  const n = $$(name) // Always depends on name
  
  if ($$(showDetails)) {
    return `${n} - ${$$(details)}` // Conditionally depends on details
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
console.log($$(userStore.personal.name)) // 'John'
console.log($$(userStore.preferences.theme)) // 'dark'

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
// Access array items
console.log($$(userStore.todos[0].text)) // 'Learn Woby'

// Update array items
userStore.todos[0].done(true)

// Replace entire array
userStore.todos([
  { id: 1, text: 'Learn Woby', done: true },
  { id: 2, text: 'Build app', done: false }
])
```

## Batching

Batch multiple updates to prevent unnecessary re-renders:

```typescript
import { batch } from 'woby'

const firstName = $('John')
const lastName = $('Doe')
const fullName = $(() => `${$$(firstName)} ${$$(lastName)}`)

// Without batching - triggers multiple updates
firstName('Jane')
lastName('Smith')

// With batching - triggers only one update
batch(() => {
  firstName('Bob')
  lastName('Johnson')
})
```

## Enhanced Observable Functions

Recent enhancements to Soby (which Woby uses as its reactive core) have added automatic `valueOf()` and `toString()` methods to observable functions. These methods use `deepResolve()` to automatically resolve observables to their current values in various contexts.

### Technical Implementation

The enhancement was implemented in Soby's `src/objects/callable.ts` by adding the following lines to both `readable` and `writable` observable function generators:

```typescript
fn.valueOf = () => deepResolve(fn)
fn.toString = () => fn.valueOf().toString()
```

This change affects the creation of observable functions, making them behave more naturally in JavaScript contexts where primitives are expected.

### Automatic String Conversion in JSX

Observables now automatically resolve to their values in JSX expressions:

```typescript
const Component = () => {
  const name = $('John')
  const count = $(5)
  
  return (
    <div>
      <p>Hello, {name}!</p>  // Renders: "Hello, John!"
      <p>Count: {count}</p>   // Renders: "Count: 5"
    </div>
  )
}
```

### Template Literals

Observables automatically resolve in template literals:

```typescript
const name = $('John')
const age = $(30)

console.log(`User: ${name}, Age: ${age}`)
// Outputs: "User: John, Age: 30"
```

### Mathematical Operations

Observables automatically resolve in mathematical operations:

```typescript
const price = $(19.99)
const quantity = $(3)
const taxRate = $(0.08)

const subtotal = price * quantity  // Results in 59.97
const tax = subtotal * taxRate     // Results in 4.7976
const total = subtotal + tax       // Results in 64.7676
```

### DOM Attribute Binding

When binding observables to DOM attributes, they automatically convert to appropriate string representations:

```typescript
const isVisible = $(true)
const opacity = $(0.5)
const fontSize = $(16)

const element = (
  <div 
    hidden={!isVisible} 
    style={{ 
      opacity: opacity,
      fontSize: `${fontSize}px`
    }}
  >
    Content
  </div>
)
```

### Nested Object Properties

Enhanced observables work seamlessly with nested objects and stores:

```typescript
import { store } from 'woby'

const user = store({ 
  profile: {
    name: $('John'), 
    age: $(30)
  },
  settings: {
    theme: $('dark')
  }
})

// Automatic resolution in string contexts
console.log(`User: ${user.profile.name}, Age: ${user.profile.age}, Theme: ${user.settings.theme}`)
// Outputs: "User: John, Age: 30, Theme: dark"
```

### Performance Considerations

The `deepResolve` function recursively resolves observables, which means for deeply nested structures there could be performance implications in hot paths. The resolution happens every time `valueOf()` or `toString()` is called.

For performance-critical applications with deeply nested structures, explicit unwrapping with `$$()` may be preferred:

```typescript
// This maintains reactivity by directly passing the observable
const reactive = <div>{deeplyNestedObject}</div>

// This unwraps the observable to get its static value, losing reactivity
const staticValue = <div>{$$(deeplyNestedObject)}</div>

// With the valueOf enhancement, mathematical operations are simplified
const price = $(19.99);
const quantity = $(3);
const total = <div>Total: {() => price * quantity}</div>; // Automatically computes 59.97
```

### Backward Compatibility

This enhancement improves rather than breaks existing functionality:

1. All existing code continues to work as before
2. Explicit unwrapping with `$$()` still works and may be preferred in performance-critical situations
3. The enhancement provides additional convenience without removing any capabilities

## Reactive Utilities

Woby provides several utility functions for working with reactive observables, built on top of the Soby reactive core. Recent enhancements to Soby have significantly improved how observables work in various JavaScript contexts.

### Observable Creation ($)

The `$()` function creates reactive observables that can track dependencies and notify subscribers of changes.

```typescript
import { $ } from 'woby'

// Create a primitive observable
const count = $(0)

// Create a computed observable
const doubled = $(() => $(count) * 2)

// Create an observable with custom equality function
const user = $({ id: 1, name: 'John' }, {
  equals: (a, b) => a.id === b.id
})
```

### Observable Unwrapping ($$)

The `$$()` function (alias for Soby's `$.get`) safely unwraps observables, providing a consistent way to access values whether they're observables or plain values.

```typescript
import { $, $$ } from 'woby'

// Unwrap a primitive observable
const count = $(0)
console.log($$(count)) // 0

// Unwrap a computed observable
const doubled = $(() => $$(count) * 2)
console.log($$(doubled)) // 0

// Safely unwrap uncertain values
const maybeObservable = getValue() // Could be observable or plain value
const value = $$(maybeObservable) // Works for both cases
```

### API Reference

#### `$$` Function

Alias for Soby's `$.get` function.

```typescript
function $$<T>(value: T, getFunction?: boolean): T extends (() => infer U) ? U : T
```

Parameters:
- `value`: The value to unwrap (observable, function, or plain value)
- `getFunction`: Whether to execute functions (default: true)

Returns:
- The unwrapped value if the input is an observable or function
- The original value if it's neither an observable nor a function

Examples:
```typescript
import { $, $$ } from 'woby'

// Unwrapping observables
const obs = $(42)
console.log($$(obs)) // 42

// Unwrapping functions
console.log($$(() => 'hello')) // 'hello'

// Plain values
console.log($$(123)) // 123

// Opt out of function execution
const fn = () => 'function result'
console.log($$(fn, false)) // () => 'function result'
```

## Advanced Patterns

### Computed Observables with Complex Logic

```typescript
const items = $([
  { id: 1, name: 'Item 1', price: 10 },
  { id: 2, name: 'Item 2', price: 20 },
  { id: 3, name: 'Item 3', price: 30 }
])

const total = $(() => {
  return $$(items).reduce((sum, item) => sum + item.price, 0)
})

console.log($$(total)) // 60
```

### Reactive Filtering and Mapping

```typescript
const todos = $([
  { id: 1, text: 'Task 1', done: true },
  { id: 2, text: 'Task 2', done: false },
  { id: 3, text: 'Task 3', done: true }
])

const completedTodos = $(() => {
  return $$(todos).filter(todo => todo.done)
})

const todoTexts = $(() => {
  return $$(todos).map(todo => todo.text)
})
```

### Async Data with Resources

```typescript
import { useResource } from 'woby'

const UserProfile = ({ userId }) => {
  const user = useResource(async () => {
    const response = await fetch(`/api/users/${userId}`)
    return response.json()
  })
  
  return (
    <div>
      <If when={() => $$(user.loading)}>
        <p>Loading...</p>
      </If>
      
      <If when={user}>
        <h1>{$$(user).name}</h1>
        <p>Age: {$$(user).age}</p>
      </If>
    </div>
  )
}
```

## Best Practices

### Efficient Observable Usage

1. **Minimize Observable Creation**: Create observables at the appropriate scope level
2. **Use Computed Observables**: For derived values that depend on other observables
3. **Batch Updates**: When updating multiple observables that affect the same computation

### When to Use $$ vs Direct Observable Usage

1. **In JSX Expressions**: Direct observable passing is preferred for simple cases:
```typescript
const Component = () => {
  const userName = $('John')
  return <div>Hello {userName}</div> // Preferred
}
```

2. **In Complex Expressions**: Use function expressions for complex logic:
```typescript
const Component = () => {
  const count = $(0)
  return <div>Count: {() => $$(count) > 0 ? $$(count) : 'None'}</div>
}
```

3. **In Utility Functions**: Use `$$` when you need to ensure a value is unwrapped:
```typescript
const processData = (value) => {
  const unwrapped = $$(value) // Ensures we have the actual value
  return unwrapped.toString().toUpperCase()
}
```

### When to Use Explicit Unwrapping

For cases where you need the current static value of an observable rather than maintaining reactivity, it may be preferable to use explicit unwrapping with `$$()`:

```typescript
// This maintains reactivity by directly passing the observable
const reactive = <div>{deeplyNestedObject}</div>

// This unwraps the observable to get its static value, losing reactivity
const staticValue = <div>{$$(deeplyNestedObject)}</div>

// With the valueOf enhancement, mathematical operations are simplified
const price = $(19.99);
const quantity = $(3);
const total = <div>Total: {() => price * quantity}</div>; // Automatically computes 59.97
```

### Observable Update Syntax

Woby provides multiple ways to update observables, all of which are valid and functionally equivalent:

```typescript
const count = $(0)

// Method 1: Direct observable reference (recommended)
count(count + 1)

// Method 2: Using $$ unwrapping
count($$(count) + 1)

// Method 3: Using function updater (similar to React)
count(c => c + 1)
```

All three methods will correctly update the observable value and trigger any dependent computations or UI updates.

### Avoiding Common Pitfalls

1. **Don't Call `$$()` in Reactive Contexts**: This prevents automatic dependency tracking
2. **Don't Mutate Objects Directly**: Use store methods or create new objects
3. **Be Mindful of Circular Dependencies**: These can cause infinite update loops

## Effect Management

Effects are used for side effects that should run when dependencies change:

```typescript
import { useEffect } from 'woby'

const Component = () => {
  const count = $(0)
  
  // Runs when count changes
  useEffect(() => {
    console.log(`Count is now: ${$$(count)}`)
  })
  
  return (
    <button onClick={() => count(c => $$(c) + 1)}>
      Increment: {count}
    </button>
  )
}