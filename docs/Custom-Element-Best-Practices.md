# Custom Element Best Practices in Woby

This document explains the key differences between ordinary functional components and custom elements in Woby, focusing on proper props initialization, two-way synchronization, and best practices for creating robust custom elements.

## Key Differences Between Ordinary Components and Custom Elements

### 1. Props Initialization

**Ordinary Functional Components** can use inline parameter initialization:
```typescript
// ✅ Ordinary component with inline initialization
const Counter = ({ value = $(0), label = "Counter" }: CounterProps) => {
  return (
    <div>
      <span>{label}: </span>
      <span>{value}</span>
    </div>
  )
}
```

**Custom Elements** must use the `defaults` and `def` pattern:
```typescript
// ✅ Custom element with proper defaults pattern
interface CounterProps {
  value?: Observable<number>
  label?: string
}

function def() {
  return {
    value: $(0, { type: 'number' } as const),
    label: 'Counter'
  }
}

const Counter = defaults(def, (props: CounterProps): JSX.Element => {
  // Must merge props with defaults for proper synchronization
  const mergedProps = merge(props, def())
  const { value, label } = mergedProps
  
  return (
    <div>
      <span>{label}: </span>
      <span>{value}</span>
    </div>
  )
})
```

### 2. Why the Difference?

The difference exists because:
1. **Custom elements** need to handle HTML attribute conversion (strings → typed values)
2. **Custom elements** require two-way synchronization between HTML attributes and component props
3. **Custom elements** must work in both HTML and JSX contexts
4. **Ordinary components** only work in JSX context with direct prop passing

## Two-Way Synchronization Requirements

### Understanding the Synchronization Flow

1. **HTML Attributes → Component Props**: When attributes change in HTML, props must update
2. **Component Props → HTML Attributes**: When props change programmatically, attributes must update

### The Critical Rule: Use Observables for Synchronization

For two-way synchronization to work, props that need to sync must be observables:

```typescript
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

### What Won't Synchronize

1. **Primitive values from HTML attributes** won't sync back to the component:
   ```html
   <!-- This attribute won't sync back to props -->
   <my-component some-attr="value"></my-component>
   ```

2. **Direct property assignments** won't sync to HTML attributes:
   ```typescript
   // ❌ This won't sync to HTML attributes
   props.someProp = newValue
   
   // ✅ This will sync to HTML attributes
   props.someProp$(newValue)
   ```

## Handling Different Prop Sources

Custom elements can receive props from different sources, and the `merge` function handles each appropriately:

### Props from Custom Elements (HTML attributes)

When instantiated from HTML:
```html
<counter-element count="5" label="My Counter"></counter-element>
```

The `merge` function:
1. Receives props parsed from HTML string attributes
2. Merges them with defaults from `def()`
3. HTML attributes take precedence over defaults

### Props from JSX/TSX Components

When used directly in JSX/TSX:
```tsx
const App = () => {
  const count = $(10)
  return <Counter count={count} label="App Counter" />
}
```

The `merge` function:
1. Receives props passed directly as JavaScript values
2. Merges them with defaults from `def()`
3. JSX props take precedence over defaults

### Inline Parameter Initialization Conflicts

Avoid inline parameter initialization in custom elements as it can conflict with the `def()` pattern:

```
// ❌ Potential conflict - inline initialization
const Counter = defaults(def, ({ count = $(0) }: CounterProps): JSX.Element => {
  // The inline default $(0) is applied before merge() is called
  // This can override the intended behavior from def()
  // ...
})

// ✅ Recommended approach - use merge
const Counter = defaults(def, (props: CounterProps): JSX.Element => {
  // merge() properly combines props from any source with def() defaults
  const mergedProps = merge(props, def())
  const { count } = mergedProps
  // ...
})
```

When inline parameters are used:
1. The inline default is applied before `merge()` is called
2. This can override the intended behavior from `def()`
3. Custom element synchronization may not work correctly

## Complete Example: Counter Component

Here's a complete example showing proper custom element implementation:

```
import { $, $$, defaults, merge, customElement } from 'woby'
import type { Observable, ObservableMaybe } from 'woby'

/**
 * Counter Component Properties
 */
interface CounterProps {
  // Use ObservableMaybe for values that can come from HTML attributes
  count?: ObservableMaybe<number>
  // Functions don't appear in HTML attributes
  increment?: () => void
  decrement?: () => void
  // Regular strings can be used for labels, etc.
  label?: string
}

/**
 * Default props function - required for custom elements
 * This is where you define the type information for synchronization
 */
function def() {
  return {
    // Typed observable for two-way synchronization
    count: $(0, { type: 'number' } as const),
    // Functions are not synchronized
    increment: () => {},
    decrement: () => {},
    // Regular string (no synchronization needed)
    label: 'Counter'
  }
}

/**
 * Counter Component
 * Must use defaults() and merge() for proper custom element behavior
 */
const Counter = defaults(def, (props: CounterProps): JSX.Element => {
  // Critical: Merge props with defaults for two-way synchronization
  const mergedProps = merge(props, def())
  
  const { count, increment, decrement, label } = mergedProps
  
  return (
    <div>
      <label>{label}: </label>
      <span>{count}</span>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </div>
  )
})

// Register as custom element
customElement('counter-element', Counter)

export default Counter
```

## Usage Patterns

### 1. HTML Usage (with synchronization)
```
<!-- HTML attributes will be converted and synchronized -->
<counter-element 
  count="5" 
  label="My Counter">
</counter-element>
```

### 2. JSX Usage (with synchronization)
```tsx
const App = () => {
  const count = $(10)
  
  const increment = () => count(prev => prev + 1)
  const decrement = () => count(prev => prev - 1)
  
  return (
    <counter-element 
      count={count} 
      increment={increment}
      decrement={decrement}
      label="App Counter">
    </counter-element>
  )
}
```

### 3. Pure Component Usage (no synchronization)
``tsx
const App = () => {
  const count = $(10)
  
  const increment = () => count(prev => prev + 1)
  const decrement = () => count(prev => prev - 1)
  
  return (
    <Counter 
      count={count} 
      increment={increment}
      decrement={decrement}
      label="Direct Component">
    </Counter>
  )
}
```

## Common Pitfalls and Solutions

### 1. Not Using merge() Function
```
// ❌ Wrong - no synchronization
const Counter = defaults(def, (props: CounterProps): JSX.Element => {
  const { count, increment, decrement } = props  // Direct destructuring
  // ...
})
// ✅ Correct - with synchronization
const Counter = defaults(def, (props: CounterProps): JSX.Element => {
  const mergedProps = merge(props, def())  // Merge for synchronization
  const { count, increment, decrement } = mergedProps
  // ...
}, def)
```

### 2. Inline Parameter Initialization
```
// ❌ Wrong - inline initialization breaks custom element behavior
const Counter = defaults(def, ({ count = $(0) }: CounterProps): JSX.Element => {
  // ...
})
// ✅ Correct - use def() function pattern
const Counter = defaults(def, (props: CounterProps): JSX.Element => {
  const mergedProps = merge(props, def())
  const { count } = mergedProps
  // ...
})
```

### 3. Missing Type Information
```
// ❌ Wrong - no type information
function def() {
  return {
    count: $(0)  // Will be treated as string
  }
}

// ✅ Correct - with type information
function def() {
  return {
    count: $(0, { type: 'number' } as const)  // Will be treated as number
  }
}
```

## Best Practices Summary

1. **Always use the `defaults` and `def` pattern** for custom elements
2. **Always use `merge(props, def())`** in your component for synchronization
3. **Specify type information** for non-string observables using `{ type: '...' } as const`
4. **Don't use inline parameter initialization** in custom elements
5. **Only functions and complex objects** should not be synchronized (they don't appear in HTML attributes)
6. **Test both HTML and JSX usage** to ensure proper synchronization
7. **Use `ObservableMaybe<T>`** for props that can come from HTML attributes

## Type Synchronization Reference

| Type | HTML Attribute | Component Prop | Notes |
|------|----------------|----------------|-------|
| number | `"5"` | `$(5)` | Use `{ type: 'number' }` |
| boolean | `"true"` | `$(true)` | Use `{ type: 'boolean' }` |
| string | `"text"` | `"text"` | Default behavior |
| object | `'{"a":1}'` | `$( {a:1} )` | Use `{ type: 'object' }` |
| function | N/A | Function | Not synchronized |
| undefined | N/A | `undefined` | Not synchronized |

This approach ensures that your custom elements work seamlessly in both HTML and JSX contexts with proper two-way synchronization.