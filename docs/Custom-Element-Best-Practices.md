# Custom Element Best Practices in Woby

This document explains the key differences between ordinary functional components and custom elements in Woby, focusing on proper props initialization, two-way synchronization, and best practices for creating robust custom elements.

For a practical, hands-on guide with detailed examples, see the [Custom Element Practical Guide](./demos/Custom-Element-Practical-Guide.md).

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

## HTML Attribute Serialization

Custom elements support custom serialization of observable values to and from HTML attributes using the `toHtml` and `fromHtml` options:

### Hiding Properties from HTML Attributes

To prevent a property from appearing in HTML attributes, use the `toHtml` option with a function that returns `undefined`:

```typescript
function def() {
  const value = $(0, { type: 'number' } as const)
  return {
    value,
    increment: $([() => { value($$(value) + 10) }], { toHtml: o => undefined }), //hide this from html attributes
  }
}
```

### Object and Date Serialization

To serialize complex objects and dates to and from HTML attributes, use the `toHtml` and `fromHtml` options:

```typescript
function def() {
  return {
    obj: $({ nested: { text: 'abc' } }, { 
      toHtml: o => JSON.stringify(o), 
      fromHtml: o => JSON.parse(o) 
    }),
    date: $(new Date(), { 
      toHtml: o => o.toISOString(), 
      fromHtml: o => new Date(o) 
    })
  }
}
```

These serialization options allow complex JavaScript objects and Date instances to be properly converted to and from HTML attribute strings, enabling two-way synchronization between HTML attributes and component props.

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

```typescript
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

```typescript
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
  // Complex objects with custom serialization
  obj?: Observable<{ nested: { text: string } }>
  // Dates with custom serialization
  date?: Observable<Date>
}

/**
 * Default props function - required for custom elements
 * This is where you define the type information for synchronization
 */
function def() {
  const value = $(0, { type: 'number' } as const)
  return {
    // Typed observable for two-way synchronization
    count: value,
    // Functions are not synchronized, hidden from HTML attributes
    increment: $([() => { value($$(value) + 1) }], { toHtml: o => undefined }),
    decrement: $([() => { value($$(value) - 1) }], { toHtml: o => undefined }),
    // Regular string (no synchronization needed)
    label: 'Counter',
    // Complex object with custom serialization
    obj: $({ nested: { text: 'abc' } }, { 
      toHtml: o => JSON.stringify(o), 
      fromHtml: o => JSON.parse(o) 
    }),
    // Date with custom serialization
    date: $(new Date(), { 
      toHtml: o => o.toISOString(), 
      fromHtml: o => new Date(o) 
    })
  }
}

/**
 * Counter Component
 * Must use defaults() and merge() for proper custom element behavior
 */
const Counter = defaults(def, (props: CounterProps): JSX.Element => {
  // Critical: Merge props with defaults for two-way synchronization
  const mergedProps = merge(props, def())
  
  const { count, increment, decrement, label, obj, date } = mergedProps
  
  return (
    <div>
      <label>{label}: </label>
      <span>{count}</span>
      <button onClick={() => increment[0]()}>+</button>
      <button onClick={() => decrement[0]()}>-</button>
      <p>Object: {() => JSON.stringify($$(obj))}</p>
      <p>Date: {() => $$(date).toString()}</p>
    </div>
  )
})

// Register as custom element
customElement('counter-element', Counter)

export default Counter
```

## Usage Patterns

### 1. HTML Usage (with synchronization)
```html
<!-- HTML attributes will be converted and synchronized -->
<counter-element 
  count="5" 
  label="My Counter"
  obj='{"nested":{"text":"xyz"}}'
  date="2023-01-01T00:00:00.000Z">
</counter-element>
```

### 2. JSX Usage (with synchronization)
```tsx
const App = () => {
  const count = $(10)
  
  return (
    <counter-element 
      count={count} 
      label="App Counter"
      obj={$({ nested: { text: 'xyz' } }, { 
        toHtml: o => JSON.stringify(o), 
        fromHtml: o => JSON.parse(o) 
      })}
      date={$(new Date())}>
    </counter-element>
  )
}
```

### 3. Pure Component Usage (no synchronization)
```tsx
const App = () => {
  const count = $(10)
  
  return (
    <Counter 
      count={count} 
      label="Direct Component">
    </Counter>
  )
}
```

## Common Pitfalls and Solutions

### 1. Not Using merge() Function
```typescript
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
```typescript
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
```typescript
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

### 4. Not Hiding Functions from HTML Attributes
```typescript
// ❌ Wrong - functions will appear in HTML attributes
function def() {
  return {
    increment: $([() => { /* increment logic */ }]) // Will appear as "[object Object]" in HTML
  }
}

// ✅ Correct - hide functions from HTML attributes
function def() {
  return {
    increment: $([() => { /* increment logic */ }], { toHtml: o => undefined }) // Hidden from HTML
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
8. **Use `toHtml: () => undefined`** to hide functions from HTML attributes
9. **Use `toHtml` and `fromHtml`** for complex object and date serialization
10. **Store functions in observables using array notation** when they need to be passed to custom elements
11. **Use array notation for functions**: To store a function in an observable, use the array notation `$([() => { /* function body */ }])`. This allows functions to be passed as props to custom elements while keeping them hidden from HTML attributes when the `toHtml: o => undefined` option is used.

For practical, hands-on examples and patterns, see the [Custom Element Practical Guide](./demos/Custom-Element-Practical-Guide.md).

## Type Synchronization Reference

| Type | HTML Attribute | Component Prop | Notes |
|------|----------------|----------------|-------|
| number | `"5"` | `$(5)` | Use `{ type: 'number' }` |
| boolean | `"true"` | `$(true)` | Use `{ type: 'boolean' }` |
| string | `"text"` | `"text"` | Default behavior |
| object | `'{"a":1}'` | `$( {a:1} )` | Use `{ type: 'object' }` |
| function | N/A | Function | Not synchronized, use `toHtml: () => undefined` |
| undefined | N/A | `undefined` | Not synchronized |
| Date | `"2023-01-01T00:00:00.000Z"` | `$(new Date(...))` | Use `toHtml` and `fromHtml` options |
| Complex Object | `'{"nested":{"text":"abc"}}'` | `$( {nested: {text: "abc"}} )` | Use `toHtml` and `fromHtml` options |

This approach ensures that your custom elements work seamlessly in both HTML and JSX contexts with proper two-way synchronization.