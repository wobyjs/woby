# Custom Element Implementation

This module provides functionality to create custom HTML elements with reactive properties that integrate seamlessly with the Woby framework's observable system.

## Overview

The `customElement` function allows you to define custom HTML elements that can:
- Observe attribute changes and automatically update corresponding props
- Handle nested properties (e.g., `nested-prop-value`)
- Process style attributes (e.g., `style-color`, `style-font-size`)
- Work with Woby's observable system for reactive updates
- Be embedded directly in HTML files without JavaScript initialization

## API Reference

### `customElement<P>(tagName, children, ...attributes)`

Creates and registers a custom HTML element.

**Parameters:**
- `tagName`: The HTML tag name for the custom element
- `children`: The component function that renders the element's content
- `attributes`: Rest parameter of attribute patterns to observe (supports wildcards)

**Returns:** The custom element class

**Example:**
```tsx
const Counter = ({ value }: { value: Observable<number> }) => (
  <div>
    <p>{value}</p>
  </div>
)

customElement('counter-element', Counter, 'value', 'style-*')

// Usage in JSX:
// <counter-element value={$(0)} style-color="red"></counter-element>

// Usage in HTML:
// <counter-element style-color="red"></counter-element>
```

### `ElementAttributes<T>`

Type helper for defining the attributes that a custom element accepts.

### `ElementAttributePattern<P>`

Type definition for allowed attribute patterns, supporting wildcards and style properties.

## Helper Functions

### `kebabToCamelCase(str)`

Converts kebab-case strings to camelCase (e.g., 'font-size' → 'fontSize').

### `setObservableValue(obj, key, value)`

Sets values on observables with automatic type conversion.

Handles setting values on observables with automatic type conversion.
Numbers are converted from strings when the observable contains a numeric value.
If the property is not an observable, it sets the value directly.

### `setNestedProperty(obj, path, value)`

Sets nested properties on an element, handling style properties and nested objects.

### `getNestedProperty(obj, path)`

Retrieves values from nested property paths.

### `matchesWildcard(attributeName, patterns)`

Checks if an attribute name matches any of the provided patterns.

## Usage Examples

### Basic Custom Element

```tsx
const SimpleCounter = ({ count }: { count: Observable<number> }) => (
  <div>
    <span>Count: {count}</span>
  </div>
)

customElement('simple-counter', SimpleCounter, 'count')
```

### Custom Element with Style Attributes

```tsx
const StyledBox = ({ color, size }: { color: string, size: string }) => (
  <div>
    <p>Styled Box</p>
  </div>
)

customElement('styled-box', StyledBox, 'style-*')
```

### Custom Element with Nested Properties

```tsx
const UserProfile = ({ user }: { user: { name: string, email: string } }) => (
  <div>
    <h2>{user.name}</h2>
    <p>{user.email}</p>
  </div>
)

customElement('user-profile', UserProfile, 'user-*')
```

## Complete Working Example

Here's a complete counter example that demonstrates Woby's reactive capabilities with custom elements:

```tsx
import { $, $$, useMemo, render, Observable, customElement, ElementAttributes } from 'woby'

const Counter = ({ increment, decrement, value, ...props }: { 
  increment?: () => number, 
  decrement?: () => number, 
  value?: Observable<number> 
}): JSX.Element => {
  // Provide defaults for optional props
  const counterValue = value || $(0)
  
  const handleIncrement = increment || (() => counterValue($$(counterValue) + 1))
  const handleDecrement = decrement || (() => counterValue($$(counterValue) - 1))
  
  const v = $('abc')
  const m = useMemo(() => {
    return $$(counterValue) + $$(v)
  })
  
  return <div {...props}>
    <h1>Counter</h1>
    <p>{counterValue}</p>
    <p>{m}</p>
    <button onClick={handleIncrement}>+</button>
    <button onClick={handleDecrement}>-</button>
  </div>
}

// Register as custom element
customElement('counter-element', Counter, 'value', 'class', 'style-*')

declare module 'woby' {
    namespace JSX {
        interface IntrinsicElements {
            'counter-element': ElementAttributes<typeof Counter>
        }
    }
}

const App = () => {
  const value = $(0)
  const increment = () => value(prev => prev + 1)
  const decrement = () => value(prev => prev - 1)

  return <counter-element 
    value={value} 
    increment={increment} 
    decrement={decrement} 
    class="border-2 border-black border-solid bg-amber-400" 
    style-color="red"
    style-font-size="2em"
  />
}

render(<App />, document.getElementById('app'))
```

## Key Features

### Nested Property Handling

The custom element implementation supports nested properties with dash-separated names:

```tsx
// For an attribute like "nested-prop-value", the system will:
// 1. Create nested structure in props: props.nested.prop.value
// 2. Set the value appropriately with observable support
customElement('my-element', MyComponent, 'nested-prop-value')
```

For components that need to support dynamic nested properties, you can use the `nested-${string}` pattern:

```tsx
// Support any nested property with the prefix "nested-"
customElement('my-element', MyComponent, 'nested-${string}')
```

### Style Property Processing

Style attributes are automatically converted from kebab-case to camelCase:

```tsx
// Attributes like "style-font-size" become:
// element.style.fontSize = value
customElement('my-element', MyComponent, 'style-*')
```

### Wildcard Support

The custom element system supports wildcard patterns for attribute observation:

```tsx
// Observe all attributes
customElement('my-element', MyComponent, '*')

// Observe all style attributes
customElement('my-element', MyComponent, 'style-*')

// Observe all nested attributes under a prefix
customElement('my-element', MyComponent, 'data-*')
```

### Observable Integration

All properties are integrated with Woby's observable system, providing automatic reactivity:

```tsx
// When an attribute changes, the corresponding observable is updated
// If the observable contains a numeric value, string values are automatically converted
const count = $(0) // Will convert "1", "2", etc. to numbers
const name = $('') // Will keep as string
```

### Direct HTML Embedding

Custom elements can be embedded directly in HTML files without JavaScript initialization:

```html
<!-- Works without any JavaScript -->
<counter-element 
  style-color="blue" 
  style-font-size="1.5em" 
  class="border-2 border-black border-solid bg-amber-400">
</counter-element>
```