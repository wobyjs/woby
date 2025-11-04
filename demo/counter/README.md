# Counter Component Demo

This demo showcases how to create a custom element using the Woby framework that demonstrates reactive properties, nested properties, and style attributes.

## Overview

The Counter component is a simple counter that displays a value and provides buttons to increment and decrement the value. It demonstrates:

1. Basic custom element creation with `customElement`
2. Handling of observable properties
3. Support for nested properties
4. Style attribute processing
5. Integration with Woby's reactive system
6. Direct HTML embedding capability
7. Context usage with `useContext`

## Component Structure

### `Counter` Component

A simple counter component that displays a value and provides buttons to increment and decrement the value.

**Props:**
- `increment`: Function to increment the counter (optional, defaults to incrementing the value)
- `decrement`: Function to decrement the counter (optional, defaults to decrementing the value)
- `value`: Observable containing the counter value (optional, defaults to `$(0)`)
- `nested`: Optional nested properties (optional, defaults to `{ nested: { text: $('abc') } }`)

### Custom Element Registration

The Counter component is registered as a custom element with the tag name `counter-element`.

**Observed Attributes:**
All props defined in the component's defaults are automatically observed as attributes.

## Context Usage

The demo demonstrates context hooks:

### useContext (Both JSX/TSX and Custom Elements)

The `useContext` hook works in both JSX/TSX components and custom elements defined directly in HTML. It provides special support for custom elements by attempting to retrieve context from parent elements:

``tsx
const CounterContext = createContext<number>(0)

// Provider component
<CounterContext.Provider value={42}>
  <ChildComponent />
</CounterContext.Provider>

// Consumer component
const MyComponent = () => {
  const contextValue = useContext(CounterContext)
  return <div>Context value: {contextValue}</div>
}
```

``html
<!-- In HTML custom elements -->
<counter-element>
  <counter-element><!-- This child can access parent's context --></counter-element>
</counter-element>
```

## Usage Examples

### As a Custom Element in HTML

The counter element can be embedded directly in HTML files without any JavaScript:

```html
<counter-element 
  style$color="red" 
  style$font-size="2em" 
  style.color="blue"
  style.font-size="1.5em"
  nested$nested$text="xyz" 
  nested.nested.text="abc"
  class="border-2 border-black border-solid bg-amber-400">
</counter-element>
```

### As a Custom Element in JSX

```tsx
const value = $(0)
const increment = () => value(prev => prev + 1)
const decrement = () => value(prev => prev - 1)

<counter-element 
  value={value} 
  increment={increment} 
  decrement={decrement}
  style$font-size="2em" 
  nested$nested$text="xyz" 
  class="border-2 border-black border-solid bg-amber-400">
</counter-element>
```

### As a Standard Component

```tsx
const value = $(0)
const increment = () => value(prev => prev + 1)
const decrement = () => value(prev => prev - 1)

<Counter value={value} increment={increment} decrement={decrement} />
```

## Key Features Demonstrated

### Reactive Properties

The counter value is implemented as an observable, which automatically updates the UI when changed.

### Nested Property Handling

The component demonstrates how nested properties are processed and made available to the component:
- In HTML: Both `$` notation (`nested$nested$text`) and `.` notation (`nested.nested.text`) work
- In JSX: Only `$` notation (`nested$nested$text`) works

### Style Attribute Processing

Style attributes are automatically converted from kebab-case to camelCase and applied to the element's style:
- `style$color` becomes `color`
- `style$font-size` becomes `fontSize`
- `style.color` becomes `color`
- `style.font-size` becomes `fontSize`

### Memoized Computed Values

The demo shows how to create memoized computed values that automatically update when their dependencies change.

### Direct HTML Embedding

The component can be used directly in HTML files without any JavaScript initialization, making it ideal for progressive enhancement and server-side rendering scenarios.

### Context API Usage

The demo shows how to use `useContext` (for both JSX/TSX components and custom elements) to share data between components.

## Running the Demo

To run this demo:

1. Ensure all dependencies are installed
2. Build the Woby framework
3. Serve the demo directory
4. Open in a web browser

The demo will show:
1. A counter implemented as a custom element embedded directly in HTML
2. Two counters implemented as custom elements with various attributes
3. One counter implemented as a standard component