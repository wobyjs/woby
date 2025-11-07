# Context Demo

This demo showcases how to use context in Woby applications with `useContext`.

## Overview

The Context demo demonstrates:

1. Creating context objects with `createContext`
2. Using `useContext` in both JSX/TSX components and custom elements
3. Context propagation in custom elements defined directly in HTML

## Component Structure

### `ThemeProvider` Component

A component that provides theme context to its children.

### `ThemedComponent` Component

A component that consumes theme context using `useContext`.

### Custom Element Registration

The components are registered as custom elements to demonstrate HTML usage.

## Usage Examples

### As a Custom Element in HTML

The themed element can be embedded directly in HTML files:

```html
<themed-element>
  <themed-element></themed-element>
</themed-element>
```

### As a Custom Element in JSX

```tsx
<theme-provider theme="dark">
  <themed-element>
    <themed-element></themed-element>
  </themed-element>
</theme-provider>
```

### As a Standard Component

```tsx
const App = () => {
  const theme = $('dark')
  
  return (
    <ThemeContext.Provider value={theme}>
      <ThemedComponent />
    </ThemeContext.Provider>
  )
}
```

## Key Features Demonstrated

### Context Creation

Creating context objects with default values:

```tsx
const ThemeContext = createContext<'light' | 'dark'>('light')
```

### Context Provision

Providing context values to child components:

```tsx
<ThemeContext.Provider value={theme}>
  <ChildComponent />
</ThemeContext.Provider>
```

### Context Consumption with useContext

Consuming context in both JSX/TSX components and custom elements:

```tsx
const theme = useContext(ThemeContext)
```

### Automatic Context Propagation

Context automatically propagates from parent to child custom elements in HTML:

```html
<themed-element> <!-- Parent provides context -->
  <themed-element></themed-element> <!-- Child consumes context -->
</themed-element>
```

## Running the Demo

To run this demo:

1. Ensure all dependencies are installed
2. Build the Woby framework
3. Serve the demo directory
4. Open in a web browser

The demo will show:
1. Context usage in JSX/TSX components with `useContext`
2. Context usage in custom elements defined directly in HTML
3. Context propagation from parent to child custom elements
```
