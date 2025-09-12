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
const lastName = $('Doe')

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

```
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

## Context Creation (createContext)

Create context objects for sharing data between components.

### Overview

The `createContext` function creates a context object that can be used to share data between components without having to pass props down manually at every level.

### Syntax

``typescript
function createContext<T>(defaultValue: T): ContextWithDefault<T>
function createContext<T>(defaultValue?: T): Context<T>
```

### Parameters

- `defaultValue`: The default value for the context (optional)

### Basic Example

```typescript
import { createContext, useContext } from 'woby'

// Create a context with a default value
const ThemeContext = createContext<'light' | 'dark'>('light')

// Create a context without a default value
const UserContext = createContext<User | null>(null)
```

### Provider Pattern

To provide a context value to child components, use the Provider component:

```typescript
import { createContext, useContext } from 'woby'

const CounterContext = createContext<Observable<number>>($(0))

const ParentComponent = () => {
  const count = $(0)
  
  return (
    <CounterContext.Provider value={count}>
      <ChildComponent />
    </CounterContext.Provider>
  )
}

const ChildComponent = () => {
  const count = useContext(CounterContext)
  
  return <div>Count: {count}</div>
}
```

### Context with useMountedContext

For custom elements and more flexible context usage, use `useMountedContext`:

```typescript
import { createContext, useMountedContext } from 'woby'

const CounterContext = createContext<Observable<number>>($(0))

const CounterComponent = () => {
  const { ref, context } = useMountedContext(CounterContext)
  
  return (
    <div ref={ref}>
      <p>Count: {context}</p>
      <button onClick={() => context(c => c + 1)}>+</button>
    </div>
  )
}
```

### TypeScript Support

For full TypeScript support, define the context type explicitly:

```typescript
import { createContext } from 'woby'

interface ThemeContextType {
  theme: 'light' | 'dark'
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {}
})
```

### Best Practices

1. **Use descriptive names** for context objects
2. **Provide sensible defaults** when possible
3. **Keep context values lightweight** - avoid passing large objects
4. **Use observables** for reactive context values
5. **Consider using useMountedContext** for better custom element support

## Custom Elements (customElement)

Create custom HTML elements that can be used as components with support for nested object properties.

### Overview

The `customElement` function registers a component as a standard web component that can be used directly in HTML or JSX. It now supports nested object properties through dash-separated attribute names, allowing for more organized and structured component APIs.

### Syntax

``typescript
customElement<P>(
  tagName: string, 
  component: JSX.Component<P>,
  ...attributes: ElementAttributePattern<P>[]
): void
```

### Parameters

- `tagName`: The HTML tag name for the custom element (must contain a hyphen)
- `component`: The component function to render
- `attributes`: Rest parameter of attribute patterns to observe (supports wildcards)

### Nested Properties Support

The enhanced `customElement` function now supports nested object properties through dash-separated attribute names:

- Attribute `config-theme` maps to `props.config.theme`
- Attribute `user-profile-name` maps to `props.user.profile.name`
- Attribute `actions-onClick` maps to `props.actions.onClick`

### Basic Example

``typescript
import { $, customElement } from 'woby'

// Simple component
const SimpleCounter = ({ value }: { value: number }) => {
  return <div>Count: {value}</div>
}

// Register as custom element
customElement('simple-counter', SimpleCounter, 'value')

// Usage
// <simple-counter value="5"></simple-counter>
```

### Nested Properties Example

``typescript
import { $, customElement } from 'woby'

// Component with nested props
const ThemedCounter = ({ 
  value,
  config,
  actions
}: { 
  value: number,
  config: {
    theme: string,
    size: string
  },
  actions: {
    increment: () => void
  }
}) => {
  return (
    <div class={`counter counter-${config.theme} counter-${config.size}`}>
      <span>Count: {value}</span>
      <button onClick={actions.increment}>+</button>
    </div>
  )
}

// Register with nested attributes
customElement('themed-counter', ThemedCounter,
  'value',
  'config-theme',
  'config-size',
  'actions-increment'
)

// Usage
// <themed-counter 
//   value="5" 
//   config-theme="dark" 
//   config-size="large"
//   actions-increment="handleIncrement">
// </themed-counter>
```

### Observable Integration

Nested properties work seamlessly with observables:

``typescript
import { $, customElement, useMemo } from 'woby'

const ObservableCounter = ({ 
  value,
  config
}: { 
  value: Observable<number>,
  config: {
    step: Observable<number>,
    min: number,
    max: number
  }
}) => {
  const displayValue = useMemo(() => {
    return `Value: ${$(value)}, Step: ${$(config.step)}`
  })
  
  return <div>{displayValue}</div>
}

customElement('observable-counter', ObservableCounter,
  'value',
  'config-step',
  'config-min',
  'config-max'
)
```

### TypeScript Support

For full TypeScript support, declare the custom element in the JSX namespace:

``typescript
import { customElement, ElementAttributes } from 'woby'

const MyComponent = ({ config }: { config: { theme: string } }) => {
  return <div>Theme: {config.theme}</div>
}

customElement('my-component', MyComponent, 'config-theme')

// TypeScript declaration
declare module 'woby' {
  namespace JSX {
    interface IntrinsicElements {
      'my-component': ElementAttributes<typeof MyComponent>
    }
  }
}
```

### Best Practices

These core methods form the foundation of Woby's reactivity system, enabling fine-grained updates and efficient rendering.
