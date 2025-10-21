# Custom Elements Documentation

Woby provides a powerful API for creating custom HTML elements that integrate seamlessly with the framework's observable system. These custom elements can be used both in JSX/TSX and directly in HTML. This documentation covers both the API reference and best practices for creating robust custom elements.

## Table of Contents

- [customElement](#customelement)
- [ElementAttributes](#elementattributes)
- [JSX Type Augmentation](#jsx-type-augmentation)
- [Attribute to Prop Mapping](#attribute-to-prop-mapping)
- [Type Conversion](#type-conversion)
- [Nested Properties](#nested-properties)
- [Style Properties](#style-properties)
- [Shadow DOM](#shadow-dom)
- [Context Support](#context-support)
- [HTML Attribute Serialization](#html-attribute-serialization)
- [Function Properties](#function-properties)
- [Object and Date Serialization](#object-and-date-serialization)
- [HTML vs JSX Usage](#html-vs-jsx-usage)

## customElement

Creates a custom HTML element with reactive properties that integrate with Woby's observable system.

### Syntax

```typescript
const CustomElementClass = customElement(tagName, component)
```

### Parameters

- `tagName`: The HTML tag name for the custom element (must contain a hyphen)
- `component`: The component function that renders the element's content

### Requirements

- Component must have default props defined using the `defaults` helper
- Component props that are observables will be updated with type conversion
- Tag name must contain a hyphen (per HTML custom element specification)

### Example

```tsx
import { $, customElement, defaults } from 'woby'

// Define a component with default props
const Counter = defaults(() => ({
  value: $(0, { type: 'number' } as const),
  title: $('Counter')
}), ({ value, title }) => (
  <div>
    <h1>{title}</h1>
    <p>Count: {value}</p>
    <button onClick={() => value(prev => prev + 1)}>+</button>
  </div>
))

// Register as a custom element
customElement('counter-element', Counter)
```

## ElementAttributes

A type helper that combines HTML attributes with component-specific props for better TypeScript support.

### Usage

```tsx
import { ElementAttributes } from 'woby'

const Counter = defaults(() => ({
  value: $(0)
}), ({ value }) => <div>Count: {value}</div>)

// Type definition for the custom element
declare module 'woby' {
  namespace JSX {
    interface IntrinsicElements {
      'counter-element': ElementAttributes<typeof Counter>
    }
  }
}
```

## JSX Type Augmentation

To get proper TypeScript support and IDE autocomplete for your custom elements in JSX/TSX, you need to augment the JSX namespace. This can be done in two ways:

### Method 1: In the same file as the component (Recommended)

Add the augmentation directly in the same file where you define your component:

```tsx
import { $, customElement, defaults, ElementAttributes } from 'woby'

const MyComponent = defaults(() => ({
  value: $(0)
}), ({ value }) => <div>Value: {value}</div>)

// Register as a custom element
customElement('my-component', MyComponent)

// Augment JSX intrinsic elements for better TypeScript support
declare module 'woby' {
  namespace JSX {
    interface IntrinsicElements {
      'my-component': ElementAttributes<typeof MyComponent>
    }
  }
}
```

### Method 2: In a separate declaration file

Create a separate `.d.ts` file (e.g., `jsx.d.ts`) in your project:

```ts
import { MyComponent } from './MyComponent'
import { ElementAttributes } from 'woby'

declare module 'woby' {
  namespace JSX {
    interface IntrinsicElements {
      'my-component': ElementAttributes<typeof MyComponent>
    }
  }
}
```

Make sure your `tsconfig.json` includes the declaration file in the compilation.

## Attribute to Prop Mapping

Custom elements automatically map HTML attributes to component props:

### Simple Properties

```html
<!-- HTML -->
<counter-element value="5" title="My Counter"></counter-element>

<!-- Maps to props -->
{
  value: $(5), // with type conversion
  title: $('My Counter')
}
```

### Dynamic Updates

Attributes can be updated dynamically, and the corresponding props will be updated:

```javascript
const element = document.querySelector('counter-element')
element.setAttribute('value', '10') // Updates the observable prop
```

## Type Conversion

Custom elements automatically convert string attributes to appropriate types based on observable options:

### Number

```tsx
const Counter = defaults(() => ({
  value: $(0, { type: 'number' } as const) // Specifies number type
}), ({ value }) => <div>Count: {value}</div>)

customElement('counter-element', Counter)

// HTML usage:
// <counter-element value="42"></counter-element>
// value prop will be Number(42)
```

### Boolean

```tsx
const Toggle = defaults(() => ({
  enabled: $(false, { type: 'boolean' as const }) // Specifies boolean type
}), ({ enabled }) => <div>Enabled: {enabled ? 'Yes' : 'No'}</div>)

customElement('toggle-element', Toggle)

// HTML usage:
// <toggle-element enabled="true"></toggle-element>
// <toggle-element enabled="1"></toggle-element>
// <toggle-element enabled=""></toggle-element>
// All set enabled prop to true
```

### Other Types

- `bigint`: Converted using `BigInt()`, falls back to string on error
- `object`: Parsed using `JSON.parse()`, falls back to string on error
- `symbol`: Created using `Symbol()`
- Other types: Treated as strings

## Nested Properties

Custom elements support nested properties using both dash-separated attribute names and dot notation:

### Definition

```tsx
const UserCard = defaults(() => ({
  user: {
    name: $('John'),
    details: {
      age: $(30, { type: 'number' as const })
    }
  }
}), ({ user }) => (
  <div>
    <h2>{user.name}</h2>
    <p>Age: {user.details.age}</p>
  </div>
))

customElement('user-card', UserCard)
```

### Usage

```html
<!-- Maps to user.name -->
<user-card user-name="Jane"></user-card>

<!-- Maps to user.details.age -->
<user-card user-details-age="25"></user-card>

<!-- Combined -->
<user-card user-name="Jane" user-details-age="25"></user-card>
```

### Advanced Nested Property Syntax

Woby supports both `$` and `.` notation for nested properties in HTML attributes:

```html
<!-- Using $ notation (works in both HTML and JSX) -->
<counter-element 
  nested$nested$text="Hello World"
  style$font-size="1.5em"
  style$color="red">
</counter-element>

<!-- Using . notation (HTML only) -->
<counter-element 
  nested.nested.text="Hello World"
  style.font-size="1.5em"
  style.color="red">
</counter-element>
```

**Note**: In JSX, only `$` notation is supported to maintain compatibility with JavaScript object property syntax.

### Nested Property Benefits

This feature provides several advantages over traditional frameworks like React and Solid:

1. **Direct Property Setting**: Unlike React where you need to pass complex objects as props, Woby allows you to directly set nested properties through HTML attributes
2. **HTML Compatibility**: You can set deeply nested properties directly in HTML without any JavaScript
3. **Automatic Kebab-Case Conversion**: Property names are automatically converted from kebab-case to camelCase
4. **Framework Uniqueness**: This level of nested property support is not available in React or SolidJS

## Style Properties

Custom elements support CSS style properties using the `style.*` prefix:

### Usage

```html
<counter-element 
  style.color="red"
  style.font-size="1.5em"
  style.background-color="lightblue">
</counter-element>
```

### Mapping

- `style.color` → `element.style.color = 'red'`
- `style.font-size` → `element.style.fontSize = '1.5em'`
- `style.background-color` → `element.style.backgroundColor = 'lightblue'`

### Advanced Style Property Syntax

Woby supports both `$` and `.` notation for style properties:

```html
<!-- Using $ notation -->
<counter-element style$font-size="2em" style$color="blue"></counter-element>

<!-- Using . notation -->
<counter-element style.font-size="2em" style.color="blue"></counter-element>
```

## Shadow DOM

Custom elements use Shadow DOM for encapsulation:

### Implementation Details

1. When a custom element is created, it attaches a shadow root:
   ```javascript
   const shadowRoot = this.attachShadow({ mode: 'open' })
   ```

2. The component is rendered into the shadow root:
   ```javascript
   render(createElement(component, this.props), shadowRoot)
   ```

3. This provides style and DOM encapsulation for the component.

### Slots

Custom elements support the `<slot>` element for content projection:

```tsx
const Card = defaults(() => ({}), ({ children }) => (
  <div class="card">
    <header>
      <slot name="header">Default Header</slot>
    </header>
    <main>
      {children}
    </main>
    <footer>
      <slot name="footer">Default Footer</slot>
    </footer>
  </div>
))

customElement('card-element', Card)
```

```html
<card-element>
  <span slot="header">Custom Header</span>
  <p>Main content</p>
  <span slot="footer">Custom Footer</span>
</card-element>
```

## Context Support

Custom elements have special support for accessing context values from parent components using the `useMountedContext` hook.

### Usage

```tsx
// Create a context
const ValueContext = createContext(0)

// Create a custom element that uses context for rendering only (mount is auto taken care of)
const ContextValue = defaults(() => ({}), () => {
  const context = useMountedContext(ValueContext) //direct use
  return <span>(Context Value = <b>{context}</b>)</span>
})

// Create a custom element that uses context and requires manual mounting
const ProcessedContextValue = defaults(() => ({}), () => {
  const [context, m] = useMountedContext(ValueContext)
  // Must put in {m} mounting component manually to receive context
  return <span>(Processed Context Value = <b>{useMemo(() => $$($$(context)) + ' Processed')}</b>){m}</span>
})

customElement('context-value', ContextValue)
customElement('processed-context-value', ProcessedContextValue)
```

### How it works

1. When a context Provider is used, the context value is stored on the first child node of the parent element
2. Child custom elements can access this context value using `useMountedContext`
3. The `useMountedContext` hook returns a tuple `[context, mount]` where:
   - `context` is the context value
   - `mount` is a comment element that serves as a mounting point for context traversal

### Example

```html
<value-context-provider value="42">
  <value-display></value-display>
</value-context-provider>
```

In this example, the `value-display` custom element will receive the context value of `42` from its parent provider.

### Context Usage Patterns

When using context in custom elements, there are two main patterns:

1. **Direct usage**: When you only need the context value for rendering, you can use `useMountedContext` directly
2. **Manual mounting**: When you need to process the context value or perform other operations, you must manually include the mounting element `{m}` in your JSX

The output of context usage in JSX looks like:

```tsx
<context-value><span>(Context Value = <b>0<!----></b>)</span></context-value>
<span>(Context Value = <b>0<!----></b>)</span>
```

Note that `<Counter>` components cannot be used directly in HTML, only custom elements can be used in HTML.

## HTML Attribute Serialization

Custom elements support custom serialization of observable values to and from HTML attributes using the `toHtml` and `fromHtml` options:

### Hiding Properties from HTML Attributes

To prevent a property from appearing in HTML attributes, use the `toHtml` option with a function that returns `undefined`:

```tsx
const Counter = defaults(() => ({
  value: $(0, { type: 'number' as const }),
  increment: $([() => { value($$(value) + 10) }], { toHtml: o => undefined }), //hide this from html attributes
  title: $('Counter')
}), ({ value, increment, title }) => (
  <div>
    <h1>{title}</h1>
    <p>Count: {value}</p>
    <button onClick={() => increment[0]()}>+</button>
  </div>
))
```

### Object Serialization

To serialize complex objects to and from HTML attributes, use the `toHtml` and `fromHtml` options:

```tsx
const Component = defaults(() => ({
  obj: $({ nested: { text: 'abc' } }, { 
    toHtml: o => JSON.stringify(o), 
    fromHtml: o => JSON.parse(o) 
  }),
  date: $(new Date(), { 
```

## Best Practices for Custom Elements

This section explains the key differences between ordinary functional components and custom elements in Woby, focusing on proper props initialization, two-way synchronization, and best practices for creating robust custom elements.

### Key Differences Between Ordinary Components and Custom Elements

#### 1. Props Initialization

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

#### 2. Why the Difference?

The difference exists because:
1. **Custom elements** need to handle HTML attribute conversion (strings → typed values)
2. **Custom elements** require two-way synchronization between HTML attributes and component props
3. **Custom elements** must work in both HTML and JSX contexts
4. **Ordinary components** only work in JSX context with direct prop passing

### Two-Way Synchronization Requirements

#### Understanding the Synchronization Flow

1. **HTML Attributes → Component Props**: When attributes change in HTML, props must update
2. **Component Props → HTML Attributes**: When props change programmatically, attributes must update

#### The Critical Rule: Use Observables for Synchronization

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

#### What Won't Synchronize

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

### Handling Different Prop Sources

Custom elements can receive props from different sources, and the `merge` function handles each appropriately:

#### Props from Custom Elements (HTML attributes)

When instantiated from HTML:
```html
<counter-element count="5" label="My Counter"></counter-element>
```

The `merge` function:
1. Receives props parsed from HTML string attributes
2. Merges them with defaults from `def()`
3. HTML attributes take precedence over defaults

#### Props from JSX/TSX Components

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

#### Inline Parameter Initialization Conflicts

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

### Complete Example: Counter Component

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

### Usage Patterns

#### 1. HTML Usage (with synchronization)
```html
<!-- HTML attributes will be converted and synchronized -->
<counter-element 
  count="5" 
  label="My Counter"
  obj='{"nested":{"text":"xyz"}}'
  date="2023-01-01T00:00:00.000Z">
</counter-element>
```

#### 2. JSX Usage (with synchronization)
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

#### 3. Pure Component Usage (no synchronization)
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

### Common Pitfalls and Solutions

#### 1. Not Using merge() Function
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

#### 2. Inline Parameter Initialization
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

#### 3. Missing Type Information
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

#### 4. Not Hiding Functions from HTML Attributes
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

### Best Practices Summary

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

### Type Synchronization Reference

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
```

```

```
