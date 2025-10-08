# Nested Properties Demo

**Location**: `docs/demos/Nested-Properties-Demo.md`  
**Run**: Create a new demo file with the code below

## Overview

This demo showcases the enhanced `customElement` function that now supports nested object properties. With this feature, you can set deeply nested properties directly through attributes using a dash-separated naming convention.

## Key Concepts Demonstrated

- ✅ **Nested Property Support** - Set nested object properties with attributes like `obj-prop-value={112}`
- ✅ **Backward Compatibility** - Existing flat properties continue to work as before
- ✅ **Automatic Object Creation** - Nested objects are automatically created if they don't exist
- ✅ **Observable Integration** - Nested observables work seamlessly with the reactivity system

## Complete Source Code

```typescript
import { 
  $, 
  $, 
  useMemo, 
  render, 
  Observable, 
  customElement, 
  ElementAttributes 
} from 'woby'


// Counter component with nested props support
const Counter = ({ 
  actions,
  config,
  value,
  ...props 
}: { 
  actions: {
    increment: () => number
    decrement: () => number
  }
  config: {
    step: number
    min: number
    max: number
  }
  value: Observable<number> 
}): JSX.Element => {
  // Local component state
  const v = $('abc')
  
  // Computed value with automatic dependency tracking
  const m = useMemo(() => {
    console.log($(value) + $(v))
    return $(value) + $(v)
  })
  
  return <div {...props}>
    <h1>Counter with Nested Props</h1>
    <p>Value: {value}</p>
    <p>Computed: {m}</p>
    <p>Step: {config.step}</p>
    <p>Min: {config.min}</p>
    <p>Max: {config.max}</p>
    <button onClick={actions.increment}>+</button>
    <button onClick={actions.decrement}>-</button>
  </div>
}

// Register component as custom web element with nested attributes support
customElement('nested-counter', Counter, 
  'value',
  'config-step',
  'config-min',
  'config-max',
  'actions-increment',
  'actions-decrement',
  'class'
)

// TypeScript declaration for custom element
declare module 'woby' {
  namespace JSX {
    interface IntrinsicElements {
      'nested-counter': ElementAttributes<typeof Counter>
    }
  }
}

const App = () => {
  // Application state
  const value = $(0)
  
  // State update functions
  const increment = () => value(prev => prev + 1)
  const decrement = () => value(prev => prev - 1)

  // Render the custom element with nested properties
  return <nested-counter 
    value={value}
    config-step={5}
    config-min={-10}
    config-max={100}
    actions-increment={increment}
    actions-decrement={decrement}
    class="border-2 border-blue-500 border-solid bg-cyan-200 p-4 m-2"
  />
}

render(<App />, document.getElementById('app'))
```

## Code Walkthrough

### 1. Nested Property Attributes

```typescript
customElement('nested-counter', Counter, 
  'value',
  'config-step',
  'config-min',
  'config-max',
  'actions-increment',
  'actions-decrement',
  'class'
)
```

**Key Points:**
- `config-step`, `config-min`, `config-max` map to `props.config.step`, `props.config.min`, `props.config.max`
- `actions-increment`, `actions-decrement` map to `props.actions.increment`, `props.actions.decrement`
- The dash-separated naming convention automatically creates nested objects

### 2. Component Props Interface

```typescript
const Counter = ({ 
  actions,
  config,
  value,
  ...props 
}: { 
  actions: {
    increment: () => number
    decrement: () => number
  }
  config: {
    step: number
    min: number
    max: number
  }
  value: Observable<number> 
}) => {
  // Component implementation
}
```

**Key Points:**
- Props are structured as nested objects
- The component receives the properly structured props
- No special handling needed in the component implementation

### 3. Using Nested Properties in JSX

```typescript
<nested-counter 
  value={value}
  config-step={5}
  config-min={-10}
  config-max={100}
  actions-increment={increment}
  actions-decrement={decrement}
  class="border-2 border-blue-500 border-solid bg-cyan-200 p-4 m-2"
/>
```

**Key Points:**
- `config-step={5}` sets `props.config.step = 5` in the component
- `actions-increment={increment}` sets `props.actions.increment = increment` in the component
- The attribute names use dashes to indicate nesting levels

## How It Works

### Nested Property Resolution

When the `customElement` receives an attribute like `config-step={5}`, the enhanced implementation:

1. Recognizes the dash-separated format as a nested property
2. Splits the attribute name: `['config', 'step']`
3. Navigates or creates the nested object structure in `props`
4. Sets the final property: `props.config.step = 5`

### Automatic Object Creation

If a nested object doesn't exist, it's automatically created:

```typescript
// If props.config doesn't exist, it's created as an empty object
// Then props.config.step is set to the attribute value
```

### Observable Support

Nested observables work seamlessly:

```typescript
// If props.config.step is an observable, it gets updated properly
if (isObservable(props.config.step)) {
  props.config.step(newValue)
}
```

## Benefits

### 1. Cleaner Component APIs

Instead of flattening nested structures:

```typescript
// ❌ Before - flattened props
<my-element 
  configStep={5}
  configMin={-10}
  configMax={100}
/>
```

```typescript
// ✅ After - nested props
<my-element 
  config-step={5}
  config-min={-10}
  config-max={100}
/>
```

### 2. Better Organization

Related properties are grouped logically:

```typescript
// Related properties grouped under 'config'
config-step={5}
config-min={-10}
config-max={100}

// Related properties grouped under 'actions'
actions-increment={increment}
actions-decrement={decrement}
```

### 3. Type Safety

TypeScript interfaces clearly define the nested structure:

```typescript
interface CounterProps {
  config: {
    step: number
    min: number
    max: number
  }
  actions: {
    increment: () => number
    decrement: () => number
  }
}
```

## Common Patterns

### 1. Configuration Objects

```typescript
const MyComponent = ({ config }) => (
  <div>
    <p>Theme: {config.theme}</p>
    <p>Size: {config.size}</p>
    <p>Position: {config.position.x}, {config.position.y}</p>
  </div>
)

customElement('my-component', MyComponent,
  'config-theme',
  'config-size',
  'config-position-x',
  'config-position-y'
)

// Usage:
<my-component 
  config-theme="dark"
  config-size="large"
  config-position-x={100}
  config-position-y={200}
/>
```

### 2. Event Handler Groups

```typescript
const ButtonGroup = ({ handlers }) => (
  <div>
    <button onClick={handlers.onSave}>Save</button>
    <button onClick={handlers.onCancel}>Cancel</button>
    <button onClick={handlers.onDelete}>Delete</button>
  </div>
)

customElement('button-group', ButtonGroup,
  'handlers-onSave',
  'handlers-onCancel',
  'handlers-onDelete'
)

// Usage:
<button-group 
  handlers-onSave={saveHandler}
  handlers-onCancel={cancelHandler}
  handlers-onDelete={deleteHandler}
/>
```

### 3. Style Configuration

```typescript
const StyledDiv = ({ style }) => (
  <div style={{
    color: style.color,
    backgroundColor: style.backgroundColor,
    padding: style.padding,
    margin: style.margin
  }}>
    <p>Styled content</p>
  </div>
)

customElement('styled-div', StyledDiv,
  'style-color',
  'style-backgroundColor',
  'style-padding',
  'style-margin'
)

// Usage:
<styled-div 
  style-color="blue"
  style-backgroundColor="yellow"
  style-padding="10px"
  style-margin="5px"
/>
```

## Limitations

### 1. Property Name Restrictions

Property names with dashes in the actual property name are not supported:

```typescript
// ❌ This won't work as expected
// If you actually need a property named "my-prop", this approach won't work
```

### 2. Deep Nesting Performance

Very deeply nested properties may have slight performance overhead:

```typescript
// ❌ Excessive nesting
very-deeply-nested-object-property-value={123}
```

## Best Practices

### 1. Use Logical Grouping

Group related properties under meaningful parent objects:

```typescript
// ✅ Good grouping
<button-component 
  style-width={100}
  style-height={50}
  style-color="red"
  events-onClick={handleClick}
  events-onHover={handleHover}
/>
```

### 2. Avoid Over-Nesting

Keep nesting levels reasonable for readability:

```typescript
// ❌ Too deep
config-api-endpoints-auth-login-url={loginUrl}

// ✅ Better
config-loginUrl={loginUrl}
```

### 3. Maintain Consistent Naming

Use consistent naming conventions:

```typescript
// ✅ Consistent
user-profile-name={name}
user-profile-email={email}
user-profile-avatar={avatar}

// ❌ Inconsistent
user-profile-name={name}
userEmail={email}
avatar-url={avatar}
```

## Next Steps

After mastering nested properties:

1. **[Counter Demo](./Counter-Demo.md)** - Basic counter implementation
2. **[Clock Demo](./Clock-Demo.md)** - Learn time-based updates
3. **[Playground Demo](./Playground-Demo.md)** - Explore all features interactively

## Related Documentation

- [Custom Elements](../Core-Methods.md#customelement) - Complete API reference
- [Reactivity System](../Reactivity-System.md) - Deep dive into observables
- [Component Patterns](../Examples.md) - Common component patterns