# Counter Demo

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

### Context API Usage

The demo shows how to use `useContext` (for both JSX/TSX components and custom elements) to share data between components.

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

**Location**: `demo/counter/`  
**Run**: `pnpm dev:counter`  
**Live Demo**: [CodeSandbox](https://codesandbox.io/s/demo-counter-23fv5)

## Overview

The Counter demo is the foundational example that demonstrates core Woby concepts including reactive state, event handling, component composition, and custom elements. It's the perfect starting point for learning Woby.

## Features Demonstrated

- ✅ **Reactive Observables** - Basic state management with `$()`
- ✅ **Event Handling** - Button click interactions
- ✅ **Custom Elements** - Web component registration
- ✅ **Component Composition** - Reusable component patterns
- ✅ **Computed Values** - Derived state with `useMemo`
- ✅ **State Updates** - Function-based state updates

## Complete Source Code

```tsx
/* IMPORT */
import { 
  $, 
  $$, 
  useMemo, 
  render, 
  Observable, 
  customElement, 
  ElementAttributes,
  defaults
} from 'woby'

/* MAIN */

// Define component with defaults
const Counter = defaults(() => ({
  value: $(0, { type: 'number' } as const),
  title: $('Counter'),
  increment: $([() => { /* implementation */ }], { toHtml: o => undefined }),
  nested: { nested: { text: $('abc') } },
  obj: $({ nested: { text: 'abc' } }, { toHtml: o => JSON.stringify(o), fromHtml: o => JSON.parse(o) }),
  date: $(new Date(), { toHtml: o => o.toISOString(), fromHtml: o => new Date(o) }),
  disabled: $(false, { type: 'boolean' } as const),
  children: undefined
}), ({ title, increment: inc, value, nested, disabled, obj, date, children, ...restProps }) => {
  // Access the function from the observable array
  const increment = $$(inc)[0] ?? (() => { value($$(value) + 1) })
  const decrement = () => { value($$(value) - 1) }

  const v = useMemo(() => $$($$($$(nested)?.nested)?.text))

  const m = useMemo(() => {
    return $$(value) + '' + $$(v)
  })

  return (
    <div {...restProps} style={{ border: '1px solid red' }}>
      <h1>{title}</h1>
      <p>Value: <b>{value}</b></p>
      <p>Memo: <b>{m}</b></p>
      <p>Object: {() => JSON.stringify($$(obj))}</p>
      <p>Date: {() => $$(date).toString()}</p>
      <button disabled={disabled} onClick={increment}>+</button>
      <button disabled={disabled} onClick={decrement}>-</button>
      {() => $$(children) ? <div style={{ border: '1px solid gray', padding: '10px' }}>{children}</div> : null}
      <p>------------{title} component end-------------</p>
    </div>
  )
})

// Register as custom element
customElement('counter-element', Counter)

// TypeScript declaration for custom element
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

  return (
    <counter-element 
      title={'Custom element in TSX'}
      style$color={'red'}
      style$font-size='1.1em'
      nested$nested$text='xyz'
      obj={$({ nested: { text: 'this obj will be serialized and deserialized to html attribute' }}, { toHtml: obj => JSON.stringify(obj), fromHtml: obj => JSON.parse(obj) })}
      class={'border-2 border-black border-solid bg-amber-400'}>
    </counter-element>
  )
}

render(<App />, document.getElementById('app'))
```

## Code Breakdown

### 1. Importing Woby

```typescript
import { 
  $,              // Observable creation
  $$,             // Observable unwrapping
  useMemo,        // Computed values
  render,         // DOM rendering
  Observable,     // Type definition
  customElement,  // Custom element registration
  ElementAttributes, // Type helper
  defaults        // Default props helper
} from 'woby'
```

### 2. Counter Component with Defaults

The main `Counter` component demonstrates several key concepts:

```typescript
const Counter = defaults(() => ({
  value: $(0, { type: 'number' } as const),
  title: $('Counter'),
  increment: $([() => { /* implementation */ }], { toHtml: o => undefined }),
  nested: { nested: { text: $('abc') } },
  obj: $({ nested: { text: 'abc' } }, { toHtml: o => JSON.stringify(o), fromHtml: o => JSON.parse(o) }),
  date: $(new Date(), { toHtml: o => o.toISOString(), fromHtml: o => new Date(o) }),
  disabled: $(false, { type: 'boolean' } as const),
  children: undefined
}), ({ title, increment: inc, value, nested, disabled, obj, date, children, ...restProps }) => {
  // Access the function from the observable array
  const increment = $$(inc)[0] ?? (() => { value($$(value) + 1) })
  const decrement = () => { value($$(value) - 1) }

  const v = useMemo(() => $$($$($$(nested)?.nested)?.text))

  const m = useMemo(() => {
    return $$(value) + '' + $$(v)
  })

  return (
    <div {...restProps} style={{ border: '1px solid red' }}>
      <h1>{title}</h1>
      <p>Value: <b>{value}</b></p>
      <p>Memo: <b>{m}</b></p>
      <p>Object: {() => JSON.stringify($$(obj))}</p>
      <p>Date: {() => $$(date).toString()}</p>
      <button disabled={disabled} onClick={increment}>+</button>
      <button disabled={disabled} onClick={decrement}>-</button>
      {() => $$(children) ? <div style={{ border: '1px solid gray', padding: '10px' }}>{children}</div> : null}
      <p>------------{title} component end-------------</p>
    </div>
  )
})
```

**Key Points:**
- **Defaults Function**: Uses `defaults()` to define component props with proper typing
- **Typed Observables**: Observables have type information for automatic conversion
- **Function Storage**: Functions stored in arrays with `toHtml: o => undefined` to hide from HTML
- **Custom Serialization**: Objects and Dates use `toHtml`/`fromHtml` for serialization
- **Nested Properties**: Supports nested object structures
- **Children Support**: Handles child elements properly

### 3. Custom Element Registration

```typescript
customElement('counter-element', Counter)
```

This registers the `Counter` component as a custom web element:
- **Element Name**: `counter-element`
- **Component**: The `Counter` function component with defaults
- **Automatic Attribute Handling**: All props automatically observed as attributes

### 4. TypeScript Integration

```typescript
declare module 'woby' {
  namespace JSX {
    interface IntrinsicElements {
      'counter-element': ElementAttributes<typeof Counter>
    }
  }
}
```

This provides full TypeScript support for the custom element, including:
- **Prop Types**: Correct typing for all component props
- **Attribute Validation**: Compile-time checking of attributes
- **IntelliSense**: Auto-completion in IDEs

### 5. App Component and Usage

```typescript
const App = () => {
  return (
    <counter-element 
      title={'Custom element in TSX'}
      style$color={'red'}
      style$font-size='1.1em'
      nested$nested$text='xyz'
      obj={$({ nested: { text: 'this obj will be serialized and deserialized to html attribute' }}, { toHtml: obj => JSON.stringify(obj), fromHtml: obj => JSON.parse(obj) })}
      class={'border-2 border-black border-solid bg-amber-400'}>
    </counter-element>
  )
}
```

**Key Points:**
- **Consistent Notation**: Uses `$` notation for JSX attributes
- **Style Properties**: `style$color` and `style$font-size` work in JSX
- **Nested Properties**: `nested$nested$text` for nested object access
- **Custom Serialization**: Objects with `toHtml`/`fromHtml` functions

## Key Learning Concepts

### 1. Reactive State with Observables

```typescript
const count = $(0)        // Create observable
console.log(count())      // Read current value
count(5)                  // Set new value
count(prev => prev + 1)   // Update with function
```

Observables are the foundation of Woby's reactivity:
- **Creation**: `$()` creates reactive state
- **Reading**: Call as function `count()` to get value
- **Setting**: Call with value `count(5)` to set
- **Updating**: Use function `count(prev => prev + 1)` for safe updates

### 2. Automatic Dependency Tracking

```typescript
const doubled = useMemo(() => count() * 2)
```

Woby automatically tracks dependencies:
- **No arrays**: No need to specify what the computed value depends on
- **Automatic updates**: When `count` changes, `doubled` updates automatically
- **Fine-grained**: Only components using `doubled` re-render

### 3. Component Composition

```typescript
// Component accepts observables as props
const Counter = ({ value, increment, decrement }) => {
  return (
    <div>
      <p>{value}</p>
      <button onClick={increment}>+</button>
    </div>
  )
}
```

Components work naturally with observables:
- **Props**: Observables passed as regular props
- **Display**: Observables displayed directly in JSX
- **Events**: Functions called directly from event handlers

### 4. Custom Elements with Consistent Notation

```html
<!-- HTML usage - both syntaxes work -->
<counter-element 
  style$color="red" 
  style$font-size="2em" 
  style.color="blue"
  style.font-size="1.5em"
  nested$nested$text="xyz"
  nested.nested.text="abc">
</counter-element>
```

```tsx
// JSX usage - only $ notation works
<counter-element 
  style$color={'red'}
  style$font-size='2em'
  nested$nested$text='xyz'>
</counter-element>
```

Turn any component into a web component with flexible syntax support:
- **Style Properties**: 
  - HTML: `style$property-name` or `style.property-name`
  - JSX: `style$property-name`
- **Nested Properties**: 
  - HTML: `parent$child$property` or `parent.child.property`
  - JSX: `parent$child$property`
- **Standard Attributes**: Work as expected (class, id, etc.)

## Performance Characteristics

### Fine-Grained Updates

The counter demo showcases Woby's fine-grained reactivity:

```
// When count changes from 5 to 6:
// ❌ React: Entire component re-renders
// ✅ Woby: Only the <p>{value}</p> text node updates
```

### No Virtual DOM Overhead

```
// Direct DOM manipulation
value(6)  // Immediately updates DOM text node
```

### Automatic Optimization

```
// Multiple updates in same frame are batched
increment()
increment()
increment()
// Only one DOM update occurs
```

## Common Patterns

### State Update Patterns

```tsx
// Increment
const increment = () => count(prev => prev + 1)

// Set to specific value
const reset = () => count(0)

// Conditional update
const incrementIfEven = () => count(prev => prev % 2 === 0 ? prev + 1 : prev)

// Batched updates
const doubleIncrement = () => batch(() => {
  count(prev => prev + 1)
  count(prev => prev + 1)
})
```

### Component Communication

```tsx
// Parent component manages state
const Parent = () => {
  const value = $(0)
  return <Counter value={value} onIncrement={() => value(v => v + 1)} />
}

// Child component receives state and callbacks
const Counter = ({ value, onIncrement }) => (
  <button onClick={onIncrement}>{value}</button>
)
```

## Variations and Extensions

### Add Reset Functionality

```tsx
const App = () => {
  const value = $(0)
  const increment = () => value(prev => prev + 1)
  const decrement = () => value(prev => prev - 1)
  const reset = () => value(0)

  return (
    <div>
      <Counter {...{ value, increment, decrement }} />
      <button onClick={reset}>Reset</button>
    </div>
  )
}
```

### Add Step Size

```tsx
const Counter = () => {
  const count = $(0)
  const step = $(1)
  
  const increment = () => count(prev => prev + step())
  const decrement = () => count(prev => prev - step())
  
  return (
    <div>
      <p>Count: {count}</p>
      <p>Step: <input value={step} onInput={e => step(+e.target.value)} /></p>
      <button onClick={increment}>+{step}</button>
      <button onClick={decrement}>-{step}</button>
    </div>
  )
}
```

### Add Persistence

```tsx
const Counter = () => {
  const count = $(parseInt(localStorage.getItem('count') || '0'))
  
  // Save to localStorage when count changes
  useEffect(() => {
    localStorage.setItem('count', count().toString())
  })
  
  return <div>Count: {count}</div>
}
```

## Next Steps

After understanding the Counter demo:

1. **Try the Clock Demo**: Learn about time-based updates and animations
2. **Explore Store Counter**: See complex state management patterns
3. **Check Performance Demos**: Understand Woby's performance benefits
4. **Build Your Own**: Create a custom counter with your own features

The Counter demo provides the foundation for understanding all other Woby concepts. Master these patterns and you'll be ready for more complex applications.

## Related Documentation

- [Basic Demos Overview](../Basic-Demos.md)
- [Code Patterns](../Code-Patterns.md)
- [Woby Core Methods](../../woby/docs/Core-Methods.md)
- [Creating New Demos](../Creating-New-Demos.md)