# Component Defaults and Two-Way Synchronization

This document explains the `defaults` pattern for creating Woby components with proper two-way synchronization between HTML attributes and component props.

For a complete guide on best practices for custom elements, see [Custom Element Best Practices](./Custom-Element-Best-Practices.md).

For information about how HTML string attributes are automatically converted to typed component props, see the [Type Synchronization Documentation](./Type-Synchronization.md).

## Overview

When creating custom elements in Woby, the `defaults` function provides seamless two-way synchronization between HTML attributes and component props:

1. **HTML Attributes → Component Props**: When a custom element is used in HTML, attributes are automatically converted to component props
2. **Component Props → HTML Attributes**: When props change programmatically, the corresponding HTML attributes are updated

This synchronization only works when components are properly wrapped with `defaults`. Without this pattern, attributes and props are not synchronized.

**Important**: Custom elements have key differences from ordinary functional components. See [Custom Element Best Practices](./Custom-Element-Best-Practices.md) for details.

## The defaults Function

The `defaults` function wraps a component and attaches default props information, enabling proper custom element behavior.

### Syntax

```typescript
defaults<P>(
  def: () => Partial<P>,
  component: (props: P) => JSX.Element
): ComponentWithDefaults<P>
```

### Parameters

- `def`: A function that returns default props
- `component`: The component function to wrap

### Example

```
import { $, defaults } from 'woby'

interface CounterProps {
  value?: Observable<number>
  increment?: () => void
  decrement?: () => void
  label?: string
}

function def() {
  const value = $(0, { type: 'number' } as const)
  return {
    value,
    increment: () => value(prev => $(prev) + 1),
    decrement: () => value(prev => $(prev) - 1),
    label: 'Counter'
  }
}

const Counter = defaults(def, (props: CounterProps): JSX.Element => {
  // The merge functionality is handled internally by the defaults function
  const { value, increment, decrement, label } = props
  
  return (
    <div>
      <span>{label}: </span>
      <span>{value}</span>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </div>
  )
})
```

## Complete Example

Here's a complete example showing the `defaults` pattern in action:

```
import { $, $$, defaults, customElement } from 'woby'
import type { Observable } from 'woby'

interface CounterProps {
  value?: Observable<number>
  increment?: () => void
  decrement?: () => void
  label?: string
}

function def() {
  const value = $(0, { type: 'number' } as const)
  return {
    value,
    increment: () => value($$(value) + 1),
    decrement: () => value($$(value) - 1),
    label: 'Count'
  }
}

const Counter = defaults(def, (props: CounterProps): JSX.Element => {
  // This enables two-way synchronization between HTML attributes and props
  // The merge functionality is handled internally
  const { value, increment, decrement, label } = props
  
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

## How Two-Way Synchronization Works

### HTML Attributes to Component Props

When a custom element is used in HTML:

```
<counter-element value="5" label="My Counter"></counter-element>
```

The attributes are automatically converted to component props:
- `value="5"` becomes `value: $(5)` (with proper type conversion)
- `label="My Counter"` becomes `label: "My Counter"`

### Component Props to HTML Attributes

When props change programmatically, the corresponding HTML attributes are updated:

```
const count = $(10)
// When count changes, the HTML attribute is automatically updated
```

## Key Requirements for Synchronization

### 1. Use Observables for Synchronized Props

Only observables can synchronize with HTML attributes:

```
// ✅ Correct - observable for synchronization
function def() {
  return {
    count: $(0, { type: 'number' } as const)  // Will sync both ways
  }
}

// ❌ Incorrect - primitive value won't sync to HTML attributes
function def() {
  return {
    count: 0  // Will NOT sync to HTML attributes
  }
}
```

### 2. Specify Type Information

For proper type conversion, specify the `type` option:

```
// ✅ Correct - with type information
function def() {
  return {
    count: $(0, { type: 'number' } as const),     // Converts "5" to 5
    enabled: $(false, { type: 'boolean' } as const), // Converts "true" to true
    data: $({} as any, { type: 'object' } as const)  // Converts JSON string to object
  }
}

// ❌ Incorrect - no type information
function def() {
  return {
    count: $(0),      // Will be treated as string
    enabled: $(true), // Will be treated as string
    data: $({})       // Will be treated as string
  }
}
```

### 3. Use defaults() Function

Always use the `defaults` function for proper synchronization:

```
// ✅ Correct - with defaults
const Counter = defaults(def, (props: CounterProps): JSX.Element => {
  const { value } = props  // Enables synchronization
  // ...
})
// ❌ Incorrect - no defaults
const Counter = (props: CounterProps): JSX.Element => {
  const { value } = props  // No synchronization
  // ...
}
```

## Handling Different Prop Sources

### Props from Custom Elements (HTML attributes)

When a custom element is instantiated from HTML, the props come from parsed HTML attributes:

```
<counter-element value="5" label="My Counter"></counter-element>
```

In this case:
- Props are created by parsing HTML string attributes
- The `defaults` function combines these parsed props with the defaults from `def()`
- HTML attributes take precedence over defaults

### Props from JSX/TSX Components

When a component is used directly in JSX/TSX:

```
const App = () => {
  const count = $(10)
  return <Counter value={count} label="App Counter" />
}
```

In this case:
- Props are passed directly as JavaScript values
- The `defaults` function combines these props with the defaults from `def()`
- JSX props take precedence over defaults

### Inline Parameter Initialization Conflicts

Using inline parameter initialization can conflict with the `def()` pattern:

```
// ❌ Potential conflict - inline initialization
const Counter = defaults(def, ({ value = $(0) }: CounterProps): JSX.Element => {
  // ...
})
// ✅ Recommended approach - use defaults
const Counter = defaults(def, (props: CounterProps): JSX.Element => {
  const { value } = props
  // ...
})
```

When inline parameters are used:
1. The inline default `$(0)` is applied before the defaults function processes the props
2. This can override the intended behavior from `def()`
3. Custom element synchronization may not work correctly

## Functions and Complex Objects

Functions and complex objects don't appear in HTML attributes and should not be expected to synchronize:

```
interface ComponentProps {
  value: Observable<number>
  // Functions don't appear in HTML attributes - no synchronization
  increment: () => void
  decrement: () => void
  // Complex objects don't appear in HTML attributes - no synchronization
  callbacks: {
    onComplete: () => void
  }
}

function def() {
  return {
    value: $(0, { type: 'number' } as const),
    // Functions are not synchronized
    increment: () => {},
    decrement: () => {},
    // Complex objects are not synchronized
    callbacks: {
      onComplete: () => {}
    }
  }
}
```

## Without Two-Way Synchronization

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

## Best Practices

1. **Always use the `defaults` pattern** for custom elements
2. **Specify type information** for non-string observables
3. **Use `as const`** with type options for better TypeScript inference
4. **Don't use inline parameter initialization** in custom elements
5. **Only functions and complex objects** should not be synchronized
6. **Test both HTML and JSX usage** to ensure proper synchronization

For a comprehensive guide to these best practices, see [Custom Element Best Practices](./Custom-Element-Best-Practices.md).