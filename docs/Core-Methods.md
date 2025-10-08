# Core Methods

This document covers the essential methods and functions provided by Woby for building reactive applications.

## Table of Contents

- [Observable Creation ($)](#observable-creation-)
- [Observable Unwrapping ($)](#observable-unwrapping-)
- [Effect Management](#effect-management)
- [Memoization](#memoization)
- [Batching](#batching)
- [Untracking](#untracking)
- [Component Rendering](#component-rendering)
- [Context Creation (createContext)](#context-creation-createcontext)
- [Custom Elements (customElement)](#custom-elements-customelement)
- [Object Assignment (assign)](#object-assignment-assign)
- [Component Defaults (defaults)](#component-defaults-defaults)

## Observable Creation ($)

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

### Observable Options

Observables can be created with options to control their behavior, including type information for custom elements:

```typescript
// Typed observables for proper HTML attribute synchronization
const count = $(0, { type: 'number' } as const)
const enabled = $(true, { type: 'boolean' } as const)
const data = $({} as any, { type: 'object' } as const)

// Custom equality function
const user = $({ id: 1, name: 'John' }, {
  equals: (a, b) => a.id === b.id
})
```

For detailed information about type synchronization between HTML attributes and component props, see the [Type Synchronization Documentation](./Type-Synchronization.md) or the [Simple Type Synchronization Guide](./Type-Sync-Simple.md) for a more straightforward approach.

## Observable Unwrapping ($)

The `$()` function safely unwraps observables, providing a consistent way to access values whether they're observables or plain values.

```typescript
import { $, $ } from 'woby'

// Unwrap a primitive observable
const count = $(0)
console.log($(count)) // 0

// Unwrap a computed observable
const doubled = $(() => $(count) * 2)
console.log($(doubled)) // 0

// Safely unwrap uncertain values
const maybeObservable = getValue() // Could be observable or plain value
const value = $(maybeObservable) // Works for both cases
```

## Effect Management

Effects automatically track dependencies and re-run when those dependencies change.

```typescript
import { $, $, useEffect } from 'woby'

const count = $(0)
const name = $('John')

// Effect automatically tracks count and name
useEffect(() => {
  console.log(`Count: ${$(count)}, Name: ${$(name)}`)
})

// Effect re-runs when either observable changes
count(1) // Logs: "Count: 1, Name: John"
name('Jane') // Logs: "Count: 1, Name: Jane"
```

## Memoization

Memoized computations automatically recompute when their dependencies change.

```typescript
import { $, $, useMemo } from 'woby'

const firstName = $('John')
const lastName = $('Doe'

// Computed observable that updates when dependencies change
const fullName = useMemo(() => {
  return `${$(firstName)} ${$(lastName)}`
})

console.log($(fullName)) // "John Doe"
firstName('Jane')
console.log($(fullName)) // "Jane Doe"
```

## Batching

Batch multiple updates to trigger only a single re-render.

```typescript
import { $, $, batch } from 'woby'

const count = $(0)
const name = $('John')

// Without batching - triggers two updates
count(1)
name('Jane')

// With batching - triggers one update
batch(() => {
  count(2)
  name('Bob')
})
```

## Untracking

Temporarily read observables without creating dependencies.

```typescript
import { $, $, untrack } from 'woby'

const count = $(0)
const other = $(0)

const computed = $(() => {
  const c = $(count) // Creates a dependency
  const o = untrack(() => $(other)) // Does not create a dependency
  return c + o
})

count(1) // Triggers update
other(1) // Does not trigger update
```

## Component Rendering

Render components to the DOM.

```typescript
import { $, render } from 'woby'

const App = () => {
  const count = $(0)
  
  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={() => count(c => $(c) + 1)}>+</button>
    </div>
  )
}

render(<App />, document.getElementById('app'))
```

**Reactive Content Patterns:**

In Woby, there are several ways to create reactive content in your components:

1. **Direct Observable Passing (Recommended for simple cases):**
```typescript
const Component = () => {
  const userName = $('John')
  
  // ✅ Direct observable - automatically reactive and preferred for single child elements
  return <div>{userName}</div>
}
```

2. **Function Expressions (For complex expressions):**
```typescript
const Component = () => {
  const userName = $('John')
  const show = $(true)
  
  // ✅ Function expression - automatically reactive
  return <div>Hello {() => $(userName)}</div>
  
  // ✅ Complex expressions with multiple observables
  return <div class={['w-full', () => $(show) ? '' : 'hidden']}>Content</div>
}
```

3. **Memoized Expressions (When needed for expensive computations):**
```typescript
const Component = () => {
  const userName = $('John')
  
  // ✅ Memoized expression - reactive but often unnecessary
  return <div>Hello {useMemo(() => $(userName))}</div>
  
  // Note: For simple expressions like this, useMemo is unnecessary
  // since () => $(userName) is automatically tracked
}
```

**Common Mistake - Non-Reactive Content:**

``typescript
const Component = () => {
  const userName = $('John')
  
  // ❌ Not reactive - only executes once
  return <div>Hello {$(userName)}</div>
}
```

In the non-reactive example above, `$()` is called during component creation (which only happens once), so the content never updates even when `userName` changes.

**Reactive Attributes:**

For attributes, you can directly pass observables for automatic reactivity:

```typescript
const Component = () => {
  const valid = $(true)
  const show = $(true)
  
  // ✅ Direct observable - automatically reactive
  return <input disabled={valid} />
  
  // ✅ Function expression - reactive
  return <input disabled={() => $(valid) ? true : undefined} />
  
  // ✅ Complex reactive class expressions
  return <div class={['w-full', () => $(show) ? '' : 'hidden']}>Content</div>
}
```

**Key Points:**
- Direct observable passing (`{userName}`) is the preferred pattern for simple cases with only one child
- Function expressions (`{() => $(userName)}`) are automatically tracked and suitable for complex expressions
- `useMemo` is unnecessary for simple expressions since `() =>` is automatically tracked
- Avoid `{$()}` patterns as they only execute once and are not reactive

## Stores

Create reactive stores for complex nested state.

```typescript
import { store, $ } from 'woby'

const userStore = store({
  personal: {
    name: 'John',
    age: 30
  },
  preferences: {
    theme: 'dark'
  }
})

// Access nested properties
console.log($(userStore.personal.name)) // 'John'
console.log($(userStore.preferences.theme)) // 'dark'

// Update nested properties
userStore.personal.name('Jane')
userStore.preferences.theme('light')
```

## Conditional Rendering

Use built-in components for conditional rendering.

```typescript
import { $, If, Switch, Match } from 'woby'

const showContent = $(true)
const status = $('loading')

const Component = () => (
  <div>
    <If when={showContent}>
      <p>This content is conditionally shown</p>
    </If>
    
    <Switch>
      <Match when={() => $(status) === 'loading'}>
        <p>Loading...</p>
      </Match>
      <Match when={() => $(status) === 'success'}>
        <p>Success!</p>
      </Match>
      <Match when={() => $(status) === 'error'}>
        <p>Error occurred</p>
      </Match>
    </Switch>
  </div>
)
```

## List Rendering

Efficiently render lists with the `For` component.

```typescript
import { $, For } from 'woby'

const items = $([
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' },
  { id: 3, name: 'Item 3' }
])

const Component = () => (
  <ul>
    <For values={items}>
      {(item) => (
        <li key={item.id}>{item.name}</li>
      )}
    </For>
  </ul>
)
```

## Event Handling

Handle DOM events with reactive callbacks.

```typescript
import { $, $ } from 'woby'

const Component = () => {
  const count = $(0)
  
  const handleClick = () => {
    count(c => $(c) + 1)
  }
  
  const handleInputChange = (e) => {
    count(parseInt(e.target.value) || 0)
  }
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={handleClick}>+</button>
      <input 
        type="number" 
        value={count}
        onInput={handleInputChange}
      />
    </div>
  )
}
```

## Resource Management

Handle asynchronous data with resource utilities.

```typescript
import { useResource, $ } from 'woby'

const DataComponent = () => {
  const data = useResource(async () => {
    const response = await fetch('/api/data')
    return response.json()
  })
  
  return (
    <div>
      <If when={() => $(data.loading)}>
        <p>Loading...</p>
      </If>
      
      <If when={() => $(data.error)}>
        <p>Error: {$(data.error).message}</p>
      </If>
      
      <If when={data}>
        <pre>{JSON.stringify($(data), null, 2)}</pre>
      </If>
    </div>
  )
}
```

## Cleanup

Register cleanup functions for components.

```typescript
import { useCleanup } from 'woby'

const Component = () => {
  const interval = setInterval(() => {
    console.log('tick')
  }, 1000)
  
  useCleanup(() => {
    clearInterval(interval)
  })
  
  return <div>Component with cleanup</div>
}

```

## Object Assignment (assign)

The `assign` function provides advanced object merging capabilities with support for observables, function preservation, deep copying, and conditional assignment.

Functions are treated specially in this function:
- Functions are never converted to observables, regardless of options
- Functions are assigned by reference directly
- This behavior ensures that callback functions and methods work correctly

```typescript
import { $, assign } from 'woby'

// Basic usage
const target = { a: 1, b: $(2) }
const source = { b: 3, c: 4 }
assign(target, source)
// Result: { a: 1, b: 3, c: 4 } where b is now an observable

// Function handling - functions are never converted to observables
const target1 = { onClick: () => console.log('target') }
const source1 = { onClick: () => console.log('source'), onHover: () => console.log('hover') }
assign(target1, source1)
// Result: { onClick: () => console.log('source'), onHover: () => console.log('hover') }
// Note: onClick is directly assigned as a function, not converted to an observable

// Copy by reference (default)
const target2 = { a: $(1) }
const source2 = { a: 2 }
assign(target2, source2)
// target2.a is updated to 2, but it's still the same observable

// Copy by value
const target3 = { a: $(1) }
const source3 = { a: 2 }
assign(target3, source3, { copyByRef: false })
// target3.a is replaced with a new observable containing 2

// Conditional assignment
const target4 = { a: 1, b: 2 }
const source4 = { b: 3, c: 4 }
assign(target4, source4, { condition: 'new' })
// Only assigns new properties: { a: 1, b: 2, c: 4 }

// Merge specific keys
const target5 = { style: 'red', class: 'btn' }
const source5 = { style: 'bold', id: 'button' }
assign(target5, source5, { merge: ['style'] })
// Merges style property: { style: 'red bold', class: 'btn', id: 'button' }

// Track source observables
const target6 = { a: $(1) }
const source6 = { a: $(2) }
assign(target6, source6, { track: true })
// Automatically updates target6.a when source6.a changes
```

## Component Defaults (defaults)

The `defaults` function attaches default props to functional components, making it easier to create reusable components with sensible defaults. When used in conjunction with the internal `merge` function, it enables two-way synchronization between HTML attributes and function component props for custom elements.

For detailed information about type synchronization between HTML attributes and component props, see the [Type Synchronization Documentation](./Type-Synchronization.md) or the [Simple Type Synchronization Guide](./Type-Sync-Simple.md) for a more straightforward approach.

### Two-Way Synchronization with Custom Elements

When creating custom elements, the `defaults` function uses an internal merge mechanism to provide seamless two-way synchronization between HTML attributes and component props:

1. **HTML Attributes → Component Props**: When a custom element is used in HTML, attributes are automatically converted to component props
2. **Component Props → HTML Attributes**: When props change programmatically, the corresponding HTML attributes are updated

This synchronization only works when components are properly wrapped with `defaults`. Without this pattern, attributes and props are not synchronized.

```typescript
import { $, defaults, customElement } from 'woby'

interface CounterProps {
  value?: Observable<number>
  increment?: () => void
  decrement?: () => void
}

// Default props function with type information
function def() {
  const value = $(0, { type: 'number' } as const)
  return {
    value,
    increment: () => value(prev => $(prev) + 1),
    decrement: () => value(prev => $(prev) - 1)
  }
}

// Component with two-way synchronization
const Counter = defaults(def, (propss: CounterProps): JSX.Element => {
  // This enables two-way synchronization between HTML attributes and props
  // The merge functionality is handled internally by the defaults function
  const { value, increment, decrement } = propss
  
  return (
    <div>
      <p>Count: {value}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </div>
  )
})

// Register as custom element
customElement('counter-element', Counter)

// Usage examples:

// 1. HTML usage with automatic attribute synchronization
// <counter-element value="5" style-color="red"></counter-element>

// 2. Function component usage
// const App = () => {
//   const count = $(10)
//   return <Counter value={count} />
// }

// 3. Both approaches work seamlessly with synchronized props
```

### How It Works

The `defaults` function stores default props information on the component and handles the merging internally:

1. **`defaults(def, component)`**: Wraps a component and attaches default props information
2. **Internal merge mechanism**: Automatically combines provided props with defaults for custom elements

### Without Two-Way Synchronization

Components that don't use the `defaults` pattern will not have attribute synchronization:

```
// ❌ No synchronization - attributes and props are not linked
const SimpleCounter = ({ value = $(0) }: { value?: Observable<number> }) => (
  <div>Count: {value}</div>
)

customElement('simple-counter', SimpleCounter)

// In HTML: <simple-counter value="5"></simple-counter>
// The value attribute will NOT be synchronized with the component prop
```

### Complete Example with Synchronization

```
import { $, defaults, customElement } from 'woby'

interface CounterProps {
  value?: Observable<number>
  increment?: () => void
  decrement?: () => void
  label?: string
}

// Default props function with type information
function def() {
  const value = $(0, { type: 'number' } as const)
  return {
    value,
    increment: () => value(prev => $(prev) + 1),
    decrement: () => value(prev => $(prev) - 1),
    label: 'Count'
  }
}

// Component with two-way synchronization
const Counter = defaults(def, (propss: CounterProps): JSX.Element => {
  // This enables two-way synchronization between HTML attributes and props
  // The merge functionality is handled internally
  const { value, increment, decrement, label } = propss
  
  return (
    <div>
      <label>{label}: </label>
      <span>{value}</span>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </div>
  )
})

// Register as custom element
customElement('counter-element', Counter)

// Usage examples:

// 1. HTML usage with automatic attribute synchronization
// <counter-element value="5" label="My Counter"></counter-element>

// 2. Function component usage
// const App = () => {
//   const count = $(10)
//   return <Counter value={count} label="App Counter" />
// }

// 3. Both approaches work seamlessly with synchronized props
```

This pattern is implemented in `@woby/woby/src/methods/defaults.ts` and is the recommended approach for creating custom elements that need to work in both HTML and JSX contexts with proper attribute synchronization.