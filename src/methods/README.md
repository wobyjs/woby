# Custom Element Implementation

This module provides functionality to create custom HTML elements with reactive properties that integrate seamlessly with the Woby framework's observable system.

## Overview

The `customElement` function allows you to define custom HTML elements that can:
- Observe attribute changes and automatically update corresponding props
- Handle nested properties (e.g., `nested$prop$value` or `nested.prop.value` in HTML, `nested$prop$value` in JSX)
- Process style attributes (e.g., `style$font-size` or `style.font-size` in HTML, `style$font-size` in JSX)
- Automatically convert kebab-case attribute names to camelCase property names
- Automatically exclude properties with `{ toHtml: () => undefined }` from HTML attributes
- Work with Woby's observable system for reactive updates
- Be embedded directly in HTML files without JavaScript initialization

## API Reference

### `customElement<P>(tagName, component)`

Creates and registers a custom HTML element.

**Parameters:**
- `tagName`: The HTML tag name for the custom element
- `component`: The component function that renders the element's content

**Returns:** The custom element class

**Example:**
```tsx
const Counter = ({ value }: { value: Observable<number> }) => (
  <div>
    <p>{value}</p>
  </div>
)

customElement('counter-element', Counter)

// Usage in JSX:
// <counter-element value={$(0)} style$font-size="red"></counter-element>

// Usage in HTML:
// <counter-element value="0" style$font-size="red"></counter-element>
// <counter-element value="0" style.font-size="red"></counter-element>
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

## Usage Examples

### Basic Custom Element

```tsx
const SimpleCounter = ({ count }: { count: Observable<number> }) => (
  <div>
    <span>Count: {count}</span>
  </div>
)

customElement('simple-counter', SimpleCounter)
```

### Custom Element with Style Attributes

```tsx
const StyledBox = ({ color, size }: { color: string, size: string }) => (
  <div>
    <p>Styled Box</p>
  </div>
)

customElement('styled-box', StyledBox)
```

### Custom Element with Nested Properties

```tsx
const UserProfile = ({ user }: { user: { name: string, email: string } }) => (
  <div>
    <h2>{user.name}</h2>
    <p>{user.email}</p>
  </div>
)

customElement('user-profile', UserProfile)
```

## Complete Working Example

Here's a complete counter example that demonstrates Woby's reactive capabilities with custom elements:

```tsx
import { $, $$, useMemo, render, Observable, customElement, ElementAttributes, defaults } from 'woby'

const Counter = defaults(() => ({
  value: $(0, { type: 'number' } as const),
  color: $('black'),
  size: $('1em')
}), ({ value, color, size }: { 
  value: Observable<number>,
  color: Observable<string>,
  size: Observable<string>
}): JSX.Element => {
  return <div style={{ color: color(), fontSize: size() }}>
    <h1>Counter</h1>
    <p>{value}</p>
    <button onClick={() => value(prev => prev + 1)}>+</button>
    <button onClick={() => value(prev => prev - 1)}>-</button>
  </div>
}

// Register as custom element
customElement('counter-element', Counter)

declare module 'woby' {
    namespace JSX {
        interface IntrinsicElements {
            'counter-element': ElementAttributes<typeof Counter>
        }
    }
}

const App = () => {
  return <counter-element 
    value={5}
    color="red"
    size="2em"
    style$font-size="2em"
  />
}

render(<App />, document.getElementById('app'))
```

## Key Features

### Nested Property Handling

The custom element implementation supports nested properties with different syntaxes:
- In HTML: Both `$` notation (`nested$prop$value`) and `.` notation (`nested.prop.value`) 
- In JSX: Only `$` notation (`nested$prop$value`)

```html
<!-- HTML usage - both syntaxes work -->
<counter-element 
  nested$prop$value="xyz"
  nested.prop.value="abc">
</counter-element>
```

```tsx
// JSX usage - only $ notation works
<counter-element 
  nested$prop$value="xyz">
</counter-element>
```

### Style Property Processing

Style attributes support different syntaxes:
- In HTML: Both `$` notation (`style$font-size`) and `.` notation (`style.font-size`)
- In JSX: Only `$` notation (`style$font-size`)

Style properties are automatically converted from kebab-case to camelCase:

```html
<!-- HTML usage - both syntaxes work -->
<counter-element 
  style$color="red" 
  style$font-size="2em"
  style.color="blue"
  style.font-size="1.5em">
</counter-element>
```

```tsx
// JSX usage - only $ notation works
<counter-element 
  style$color="red"
  style$font-size="2em">
</counter-element>
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
  value="5"
  color="blue" 
  style$font-size="1.5em" 
  style.font-size="1.5em"
  class="border-2 border-black border-solid bg-amber-400">
</counter-element>
```