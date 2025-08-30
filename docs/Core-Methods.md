# Core Methods

This document covers the essential methods and functions provided by Woby for building reactive applications.

## Table of Contents

- [Observable Creation ($)](#observable-creation-)
- [Observable Unwrapping ($$)](#observable-unwrapping-)
- [Effect Management](#effect-management)
- [Memoization](#memoization)
- [Batching](#batching)
- [Untracking](#untracking)
- [Component Rendering](#component-rendering)

## Observable Creation ($)

The `$()` function creates reactive observables that can track dependencies and notify subscribers of changes.

```typescript
import { $ } from 'woby'

// Create a primitive observable
const count = $(0)

// Create a computed observable
const doubled = $(() => $$(count) * 2)

// Create an observable with custom equality function
const user = $({ id: 1, name: 'John' }, {
  equals: (a, b) => a.id === b.id
})
```

## Observable Unwrapping ($$)

The `$$()` function safely unwraps observables, providing a consistent way to access values whether they're observables or plain values.

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

## Effect Management

Effects automatically track dependencies and re-run when those dependencies change.

```typescript
import { $, $$, useEffect } from 'woby'

const count = $(0)
const name = $('John')

// Effect automatically tracks count and name
useEffect(() => {
  console.log(`Count: ${$$(count)}, Name: ${$$(name)}`)
})

// Effect re-runs when either observable changes
count(1) // Logs: "Count: 1, Name: John"
name('Jane') // Logs: "Count: 1, Name: Jane"
```

## Memoization

Memoized computations automatically recompute when their dependencies change.

```typescript
import { $, $$, useMemo } from 'woby'

const firstName = $('John')
const lastName = $('Doe')

// Computed observable that updates when dependencies change
const fullName = useMemo(() => {
  return `${$$(firstName)} ${$$(lastName)}`
})

console.log($$(fullName)) // "John Doe"
firstName('Jane')
console.log($$(fullName)) // "Jane Doe"
```

## Batching

Batch multiple updates to trigger only a single re-render.

```typescript
import { $, $$, batch } from 'woby'

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

```
import { $, $$, untrack } from 'woby'

const count = $(0)
const other = $(0)

const computed = $(() => {
  const c = $$(count) // Creates a dependency
  const o = untrack(() => $$(other)) // Does not create a dependency
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
      <button onClick={() => count(c => $$(c) + 1)}>+</button>
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
  return <div>Hello {() => $$(userName)}</div>
  
  // ✅ Complex expressions with multiple observables
  return <div class={['w-full', () => $$(show) ? '' : 'hidden']}>Content</div>
}
```

3. **Memoized Expressions (When needed for expensive computations):**
```typescript
const Component = () => {
  const userName = $('John')
  
  // ✅ Memoized expression - reactive but often unnecessary
  return <div>Hello {useMemo(() => $$(userName))}</div>
  
  // Note: For simple expressions like this, useMemo is unnecessary
  // since () => $$(userName) is automatically tracked
}
```

**Common Mistake - Non-Reactive Content:**

``typescript
const Component = () => {
  const userName = $('John')
  
  // ❌ Not reactive - only executes once
  return <div>Hello {$$(userName)}</div>
}
```

In the non-reactive example above, `$$()` is called during component creation (which only happens once), so the content never updates even when `userName` changes.

**Reactive Attributes:**

For attributes, you can directly pass observables for automatic reactivity:

```typescript
const Component = () => {
  const valid = $(true)
  const show = $(true)
  
  // ✅ Direct observable - automatically reactive
  return <input disabled={valid} />
  
  // ✅ Function expression - reactive
  return <input disabled={() => $$(valid) ? true : undefined} />
  
  // ✅ Complex reactive class expressions
  return <div class={['w-full', () => $$(show) ? '' : 'hidden']}>Content</div>
}
```

**Key Points:**
- Direct observable passing (`{userName}`) is the preferred pattern for simple cases with only one child
- Function expressions (`{() => $$(userName)}`) are automatically tracked and suitable for complex expressions
- `useMemo` is unnecessary for simple expressions since `() =>` is automatically tracked
- Avoid `{$$()}` patterns as they only execute once and are not reactive

## Stores

Create reactive stores for complex nested state.

```typescript
import { store, $$ } from 'woby'

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
console.log($$(userStore.personal.name)) // 'John'
console.log($$(userStore.preferences.theme)) // 'dark'

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
      <Match when={() => $$(status) === 'loading'}>
        <p>Loading...</p>
      </Match>
      <Match when={() => $$(status) === 'success'}>
        <p>Success!</p>
      </Match>
      <Match when={() => $$(status) === 'error'}>
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
import { $, $$ } from 'woby'

const Component = () => {
  const count = $(0)
  
  const handleClick = () => {
    count(c => $$(c) + 1)
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
import { useResource, $$ } from 'woby'

const DataComponent = () => {
  const data = useResource(async () => {
    const response = await fetch('/api/data')
    return response.json()
  })
  
  return (
    <div>
      <If when={() => $$(data.loading)}>
        <p>Loading...</p>
      </If>
      
      <If when={() => $$(data.error)}>
        <p>Error: {$$(data.error).message}</p>
      </If>
      
      <If when={data}>
        <pre>{JSON.stringify($$(data), null, 2)}</pre>
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

These core methods form the foundation of Woby's reactivity system, enabling fine-grained updates and efficient rendering.