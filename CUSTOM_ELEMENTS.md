# Custom Elements Documentation

Woby provides a powerful API for creating custom HTML elements that integrate seamlessly with the framework's observable system. These custom elements can be used both in JSX/TSX and directly in HTML.

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
```

```

```
