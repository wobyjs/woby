# Custom Element Implementation

This module provides functionality to create custom HTML elements with reactive properties that integrate seamlessly with the Woby framework's observable system.

## Overview

The `customElement` function allows you to define custom HTML elements that can:
- Observe attribute changes and automatically update corresponding props
- Handle nested properties (e.g., `nested-prop-value`)
- Process style attributes (e.g., `style-color`, `style-font-size`)
- Work with Woby's observable system for reactive updates

## API Reference

### `customElement<P>(tagName, children, ...attributes)`

Creates and registers a custom HTML element.

**Parameters:**
- `tagName`: The HTML tag name for the custom element
- `children`: The component function that renders the element's content
- `attributes`: List of attribute names to observe (supports wildcards)

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
```

### `ElementAttributes<T>`

Type helper for defining the attributes that a custom element accepts.

### `ElementAttributePattern<P>`

Type definition for allowed attribute patterns, supporting wildcards and style properties.

## Helper Functions

### `kebabToCamelCase(str)`

Converts kebab-case strings to camelCase (e.g., 'font-size' → 'fontSize').

### `setObservableValue(observable, value)`

Sets values on observables with automatic type conversion.

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