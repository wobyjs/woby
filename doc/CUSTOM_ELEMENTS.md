# Custom Elements Documentation

Woby provides a powerful API for creating custom HTML elements that integrate seamlessly with the framework's observable system. These custom elements can be used both in JSX/TSX and directly in HTML. This documentation covers both the API reference and best practices for creating robust custom elements.

## Table of Contents

- [customElement](#customelement)
  - [Observed Attributes](#observed-attributes)
- [ElementAttributes](#elementattributes)
  - [Benefits of ElementAttributes](#benefits-of-elementattributes)
- [JSX Type Augmentation](#jsx-type-augmentation)
  - [Example from Counter Demo](#example-from-counter-demo)
  - [Best Practices for Type Augmentation](#best-practices-for-type-augmentation)
  - [Method 1: In the same file as the component (Recommended)](#method-1-in-the-same-file-as-the-component-recommended)
  - [Method 2: In a separate declaration file](#method-2-in-a-separate-declaration-file)
  - [Advanced Type Augmentation Example](#advanced-type-augmentation-example)
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
- [Component Defaults and Two-Way Synchronization](#component-defaults-and-two-way-synchronization)
- [The defaults Function](#the-defaults-function)
- [How Two-Way Synchronization Works](#how-two-way-synchronization-works)
- [Key Requirements for Synchronization](#key-requirements-for-synchronization)
- [Handling Different Prop Sources](#handling-different-prop-sources)
- [Functions and Complex Objects](#functions-and-complex-objects)
- [Without Two-Way Synchronization](#without-two-way-synchronization)
- [Best Practices](#best-practices)

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

### Observed Attributes

When you register a custom element, Woby automatically observes all props defined in your component's `def()` function. This means that HTML attributes corresponding to these props will be automatically synchronized with the component's props. For example:

```tsx
// In your component definition
const def = () => ({
  value: $(0, { type: 'number' } as const),
  title: $('Counter'),
  disabled: $(false, { type: 'boolean' } as const)
})

// When registered as a custom element, these props become observed attributes:
// - 'value': The counter value (converted from string to number)
// - 'title': The counter title (string)
// - 'disabled': Disabled state (converted from string to boolean)
// - 'class': CSS classes
// - 'style-*': Style properties (e.g., style$font-size in HTML, style-font-size in JSX)
// - 'nested-*': Nested properties (e.g., nested$nested$text in HTML, nested-nested-text in JSX)
```

The automatic observation of attributes ensures that changes to HTML attributes are immediately reflected in your component's props, and vice versa.

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

### Benefits of ElementAttributes

The `ElementAttributes` type helper provides several key benefits:

1. **Automatic HTML Attribute Support**: Automatically includes all standard HTML attributes like `class`, `id`, `style`, etc.
2. **Component Prop Typing**: Provides type safety for component-specific props
3. **Style Property Support**: Enables type checking for style properties using the `style-*` pattern
4. **Nested Property Support**: Supports type checking for nested properties using the `nested-*` pattern
5. **IDE Autocomplete**: Enables full IDE autocomplete support for both HTML attributes and component props

When you use `ElementAttributes<typeof YourComponent>`, TypeScript will automatically understand:
- All standard HTML attributes that can be applied to the element
- The specific props your component accepts
- Style properties that can be set using the `style$property-name` syntax in HTML or `style-property-name` in JSX
- Nested properties that can be set using the `nested$property$name` syntax in HTML or `nested-property-name` in JSX

This provides a seamless development experience with full type safety and IDE support for your custom elements.

## JSX Type Augmentation

To get proper TypeScript support and IDE autocomplete for your custom elements in JSX/TSX, you need to augment the JSX namespace. This can be done in two ways:

### Example from Counter Demo

The following example from the Counter demo shows advanced type augmentation with multiple custom elements and complex props:

```tsx
/**
 * Extend JSX namespace to include the custom element
 * 
 * This allows TypeScript to recognize the custom element in JSX.
 */
declare module 'woby' {
  namespace JSX {
    interface IntrinsicElements {
      /**
       * Counter custom element
       * 
       * HTML element that displays a counter with increment/decrement buttons.
       * 
       * The ElementAttributes<typeof Counter> type automatically includes:
       * - All HTML attributes
       * - Component-specific props from CounterProps
       * - Style properties via the style-* pattern (style$font-size in HTML, style-font-size in JSX)
       * - Nested properties via the nested-* pattern (nested$nested$text in HTML, nested-nested-text in JSX)
       */
      'counter-element': ElementAttributes<typeof Counter>
      'context-value': ElementAttributes<typeof ContextValue>
      'my-上下文-值': ElementAttributes<typeof ContextValue>
      'processed-context-value': ElementAttributes<typeof ProcessedContextValue>
    }
  }
}
```

This example demonstrates several advanced patterns:

1. **Multiple Custom Elements**: Type definitions for multiple custom elements in a single declaration
2. **Unicode Tag Names**: Support for Unicode characters in custom element tag names (`my-上下文-值`)
3. **Complex Props**: Automatic type inference for complex props including nested objects, functions, and observables
4. **Context Integration**: Type support for custom elements that use context

The `ElementAttributes<typeof Counter>` type automatically provides type safety for:
- Standard HTML attributes like `class`, `id`, `style`
- Component-specific props like `value`, `title`, `disabled`
- Style properties using `style$property-name` syntax
- Nested properties using `nested$property$name` syntax
- Object and Date serialization props with custom `toHtml`/`fromHtml` options

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

### Best Practices for Type Augmentation

When augmenting types for custom elements, follow these best practices:

1. **Place Type Augmentations Close to Component Definitions**: Include the type augmentation in the same file as your component definition when possible
2. **Use JSDoc Comments**: Add descriptive comments to your type definitions for better IDE support
3. **Be Specific with Tag Names**: Use descriptive, hyphenated tag names that clearly indicate the element's purpose
4. **Include All Custom Elements**: Define types for all custom elements you create in your application
5. **Use Unicode Carefully**: While Unicode tag names are supported, use them judiciously for better compatibility
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

### Best Practices for Type Augmentation

When augmenting types for custom elements, follow these best practices:

1. **Place Type Augmentations Close to Component Definitions**: Include the type augmentation in the same file as your component definition when possible
2. **Use JSDoc Comments**: Add descriptive comments to your type definitions for better IDE support
3. **Be Specific with Tag Names**: Use descriptive, hyphenated tag names that clearly indicate the element's purpose
4. **Include All Custom Elements**: Define types for all custom elements you create in your application
5. **Use Unicode Carefully**: While Unicode tag names are supported, use them judiciously for better compatibility

### Advanced Type Augmentation Example

For more complex components with multiple custom elements, you can define comprehensive type augmentations as shown in this example:

```tsx
import { $, customElement, defaults, ElementAttributes } from 'woby'

// Define components with default props
const Counter = defaults(() => ({
  value: $(0, { type: 'number' } as const),
  title: $('Counter'),
  disabled: $(false, { type: 'boolean' } as const)
}), ({ value, title, disabled }) => (
  <div>
    <h1>{title}</h1>
    <p>Count: {value}</p>
    <button disabled={disabled} onClick={() => value(prev => prev + 1)}>+</button>
  </div>
))

const ContextValue = defaults(() => ({}), () => {
  const context = useMountedContext(SomeContext)
  return <span>Context Value: {context}</span>
})

// Register as custom elements
customElement('counter-element', Counter)
customElement('context-value', ContextValue)

declare module 'woby' {
  namespace JSX {
    interface IntrinsicElements {
      /**
       * Counter custom element
       * 
       * HTML element that displays a counter with increment/decrement buttons.
       * 
       * The ElementAttributes<typeof Counter> type automatically includes:
       * - All HTML attributes
       * - Component-specific props from CounterProps
       * - Style properties via the style-* pattern (style$font-size in HTML, style-font-size in JSX)
       * - Nested properties via the nested-* pattern (nested$nested$text in HTML, nested-nested-text in JSX)
       */
      'counter-element': ElementAttributes<typeof Counter>
      'context-value': ElementAttributes<typeof ContextValue>
    }
  }
}
```

This approach provides full TypeScript support for your custom elements in JSX, including proper typing for all HTML attributes, component-specific props, style properties, and nested properties.

### Complex Prop Patterns from Counter Demo

The Counter demo showcases several advanced patterns for handling complex props in custom elements:

1. **Function Storage in Observables**: Functions are stored in observables using array notation to hide them from HTML attributes:
   ```tsx
   const def = () => ({
     // Store function in observable array to hide it from HTML attributes
     increment: $([() => { value($$(value) + 10) }], { toHtml: o => undefined })
   })
   ```

2. **Object Serialization**: Complex objects are serialized using custom `toHtml` and `fromHtml` options:
   ```tsx
   const def = () => ({
     // Object with custom serialization
     obj: $({ nested: { text: 'abc' } }, { 
       toHtml: o => JSON.stringify(o), 
       fromHtml: o => JSON.parse(o) 
     })
   })
   ```

3. **Date Serialization**: Dates are serialized using custom `toHtml` and `fromHtml` options:
   ```tsx
   const def = () => ({
     // Date with custom serialization
     date: $(new Date(), { 
       toHtml: o => o.toISOString(), 
       fromHtml: o => new Date(o) 
     })
   })
   ```

4. **Nested Properties**: Complex nested properties are supported:
   ```tsx
   const def = () => ({
     nested: { nested: { text: $('abc') } }
   })
   ```

These patterns ensure proper type safety and serialization for complex data structures while maintaining the ability to use the components both in HTML and JSX contexts.

```tsx
import { $, customElement, defaults, ElementAttributes } from 'woby'

// Define components with default props
const Counter = defaults(() => ({
  value: $(0, { type: 'number' } as const),
  title: $('Counter'),
  disabled: $(false, { type: 'boolean' } as const)
}), ({ value, title, disabled }) => (
  <div>
    <h1>{title}</h1>
    <p>Count: {value}</p>
    <button disabled={disabled} onClick={() => value(prev => prev + 1)}>+</button>
  </div>
))

const ContextValue = defaults(() => ({}), () => {
  const context = useMountedContext(SomeContext)
  return <span>Context Value: {context}</span>
})

// Register as custom elements
customElement('counter-element', Counter)
customElement('context-value', ContextValue)

declare module 'woby' {
  namespace JSX {
    interface IntrinsicElements {
      /**
       * Counter custom element
       * 
       * HTML element that displays a counter with increment/decrement buttons.
       * 
       * The ElementAttributes<typeof Counter> type automatically includes:
       * - All HTML attributes
       * - Component-specific props from CounterProps
       * - Style properties via the style-* pattern (style$font-size in HTML, style-font-size in JSX)
       * - Nested properties via the nested-* pattern (nested$nested$text in HTML, nested-nested-text in JSX)
       */
      'counter-element': ElementAttributes<typeof Counter>
      'context-value': ElementAttributes<typeof ContextValue>
    }
  }
}
```

This approach provides full TypeScript support for your custom elements in JSX, including proper typing for all HTML attributes, component-specific props, style properties, and nested properties.

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

## HTML Utility Types

Woby provides a set of HTML utility types that make it easier to work with common HTML attribute patterns. These utilities implement the `ObservableOptions` interface and provide consistent conversion between JavaScript values and HTML attributes.

### HtmlBoolean

Handles boolean values with automatic conversion from HTML string attributes:

```tsx
import { HtmlBoolean } from 'woby'

const Toggle = defaults(() => ({
  enabled: $(false, HtmlBoolean)
}), ({ enabled }) => <div>Enabled: {enabled ? 'Yes' : 'No'}</div>)

customElement('toggle-element', Toggle)

// HTML usage:
// <toggle-element enabled="true"></toggle-element>  // enabled = $(true)
// <toggle-element enabled="1"></toggle-element>     // enabled = $(true)
// <toggle-element enabled=""></toggle-element>      // enabled = $(true)
// <toggle-element enabled="false"></toggle-element> // enabled = $(false)
```

### HtmlNumber

Handles numeric values with automatic conversion from HTML string attributes:

```tsx
import { HtmlNumber } from 'woby'

const Counter = defaults(() => ({
  value: $(0, HtmlNumber)
}), ({ value }) => <div>Count: {value}</div>)

customElement('counter-element', Counter)

// HTML usage:
// <counter-element value="42"></counter-element>  // value = $(42)
// <counter-element value="-5"></counter-element>  // value = $(-5)
// <counter-element value="3.14"></counter-element> // value = $(3.14)
```

### HtmlDate

Handles Date values with ISO string serialization:

```tsx
import { HtmlDate } from 'woby'

const DatePicker = defaults(() => ({
  selectedDate: $(new Date(), HtmlDate)
}), ({ selectedDate }) => <div>Date: {() => $$(selectedDate).toString()}</div>)

customElement('date-picker', DatePicker)

// HTML usage:
// <date-picker selected-date="2023-01-01T00:00:00.000Z"></date-picker>
// selectedDate = $(new Date("2023-01-01T00:00:00.000Z"))
```

### HtmlBigInt

Handles BigInt values with automatic conversion:

```tsx
import { HtmlBigInt } from 'woby'

const BigIntComponent = defaults(() => ({
  largeNumber: $(BigInt(0), HtmlBigInt)
}), ({ largeNumber }) => <div>Number: {() => $$(largeNumber).toString()}</div>)

customElement('bigint-component', BigIntComponent)

// HTML usage:
// <bigint-component large-number="12345678901234567890"></bigint-component>
// largeNumber = $(BigInt("12345678901234567890"))
```

### HtmlObject

Handles Object values with JSON serialization:

```tsx
import { HtmlObject } from 'woby'

const ObjectComponent = defaults(() => ({
  config: $({} as any, HtmlObject)
}), ({ config }) => <div>Config: {() => JSON.stringify($$(config))}</div>)

customElement('object-component', ObjectComponent)

// HTML usage:
// <object-component config='{"key":"value","nested":{"num":42}}'></object-component>
// config = $({ key: "value", nested: { num: 42 } })
```

### HtmlLength

Handles CSS length values (px, em, rem, %, etc.):

```tsx
import { HtmlLength } from 'woby'

const SizeComponent = defaults(() => ({
  width: $('100px', HtmlLength),
  height: $('auto', HtmlLength)
}), ({ width, height }) => (
  <div style={() => ({ width: $$(width), height: $$(height) })}>
    Sized content
  </div>
))

customElement('size-component', SizeComponent)

// HTML usage:
// <size-component width="50%" height="200px"></size-component>
// width = $("50%"), height = $("200px")
```

### HtmlBox

Handles CSS box values (margin, padding, border, etc.):

```tsx
import { HtmlBox } from 'woby'

const BoxComponent = defaults(() => ({
  margin: $('10px', HtmlBox),
  padding: $('5px 10px', HtmlBox)
}), ({ margin, padding }) => (
  <div style={() => ({ margin: $$(margin), padding: $$(padding) })}>
    Box content
  </div>
))

customElement('box-component', BoxComponent)

// HTML usage:
// <box-component margin="1em" padding="5px 10px 15px 20px"></box-component>
```

### HtmlColor

Handles CSS color values (hex, rgb, etc.):

```tsx
import { HtmlColor } from 'woby'

const ColorComponent = defaults(() => ({
  backgroundColor: $('#ffffff', HtmlColor),
  textColor: $('rgb(0, 0, 0)', HtmlColor)
}), ({ backgroundColor, textColor }) => (
  <div style={() => ({ backgroundColor: $$(backgroundColor), color: $$(textColor) })}>
    Colored content
  </div>
))

customElement('color-component', ColorComponent)

// HTML usage:
// <color-component background-color="#ff0000" text-color="blue"></color-component>
// backgroundColor = $("#ff0000"), textColor = $("blue")
```

### HtmlStyle

Handles CSS style values (objects and strings):

```tsx
import { HtmlStyle } from 'woby'

const StyleComponent = defaults(() => ({
  customStyles: $({} as any, HtmlStyle)
}), ({ customStyles }) => (
  <div style={() => $$(customStyles)}>
    Styled content
  </div>
))

customElement('style-component', StyleComponent)

// HTML usage:
// <style-component custom-styles="color: red; font-size: 1.5em;"></style-component>
// customStyles = $({ color: "red", fontSize: "1.5em" })
```

### Using HTML Utility Types

All HTML utility types follow a consistent pattern:

1. **Import the utility**: Import the desired HTML utility from 'woby'
2. **Apply to observables**: Use the utility as the second parameter to `$()`
3. **Automatic conversion**: The utility handles conversion between HTML strings and JavaScript values

``tsx
import { $, defaults, customElement, HtmlBoolean, HtmlNumber, HtmlColor } from 'woby'

const StyledCounter = defaults(() => ({
  count: $(0, HtmlNumber),
  enabled: $(true, HtmlBoolean),
  color: $('#000000', HtmlColor)
}), ({ count, enabled, color }) => (
  <div style={() => ({ color: $$(color) })}>
    <span>Count: {count}</span>
    <span>Status: {enabled ? 'Enabled' : 'Disabled'}</span>
  </div>
))

customElement('styled-counter', StyledCounter)
```

### Benefits of HTML Utility Types

1. **Type Safety**: Each utility provides proper type conversion between HTML attributes and JavaScript values
2. **Consistency**: All utilities follow the same pattern and behavior
3. **Automatic Serialization**: Complex values are automatically serialized to/from HTML attributes
4. **Error Handling**: Utilities handle edge cases and invalid values gracefully
5. **Empty String Handling**: All utilities treat empty strings as `undefined` for consistent behavior
6. **Equality Checking**: Each utility implements proper equality checking for value comparison

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
    toHtml: o => o.toISOString(), 
    fromHtml: o => new Date(o) 
  })
}), ({ obj, date }) => (
  <div>
    <p>Object: {() => JSON.stringify($$(obj))}</p>
    <p>Date: {() => $$(date).toString()}</p>
  </div>
))
```

These serialization options allow complex JavaScript objects and Date instances to be properly converted to and from HTML attribute strings, enabling two-way synchronization between HTML attributes and component props.

## Component Defaults and Two-Way Synchronization

This section explains the `defaults` pattern for creating Woby components with proper two-way synchronization between HTML attributes and component props.

When creating custom elements in Woby, the `defaults` function provides seamless two-way synchronization between HTML attributes and component props:

1. **HTML Attributes → Component Props**: When a custom element is used in HTML, attributes are automatically converted to component props
2. **Component Props → HTML Attributes**: When props change programmatically, the corresponding HTML attributes are updated

This synchronization only works when components are properly wrapped with `defaults`. Without this pattern, attributes and props are not synchronized.

**Important**: Custom elements have key differences from ordinary functional components.

## The defaults Function

The `defaults` function wraps a component and attaches default props information, enabling proper custom element behavior.

### Syntax

```typescript
defaults<P>(
  def: () => Partial<P>,
  component: (props: P) => JSX.Element
): ComponentWithDefaults<P>
```

### Parameters

- `def`: A function that returns default props
- `component`: The component function to wrap

### Example

```typescript
import { $, defaults } from 'woby'

interface CounterProps {
  value?: Observable<number>
  increment?: () => void
  decrement?: () => void
  label?: string
}

function def() {
  const value = $(0, { type: 'number' } as const)
  return {
    value,
    increment: () => value(prev => $(prev) + 1),
    decrement: () => value(prev => $(prev) - 1),
    label: 'Counter'
  }
}

const Counter = defaults(def, (props: CounterProps): JSX.Element => {
  // The merge functionality is handled internally by the defaults function
  const { value, increment, decrement, label } = props
  
  return (
    <div>
      <span>{label}: </span>
      <span>{value}</span>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </div>
  )
})
```

## How Two-Way Synchronization Works

### HTML Attributes to Component Props

When a custom element is used in HTML:

```html
<counter-element value="5" label="My Counter" obj='{"nested":{"text":"xyz"}}'></counter-element>
```

The attributes are automatically converted to component props:
- `value="5"` becomes `value: $(5)` (with proper type conversion)
- `label="My Counter"` becomes `label: "My Counter"`
- `obj='{"nested":{"text":"xyz"}}'` becomes `obj: $({nested: {text: "xyz"}})` (with JSON parsing)

### Component Props to HTML Attributes

When props change programmatically, the corresponding HTML attributes are updated:

```typescript
const count = $(10)
// When count changes, the HTML attribute is automatically updated
```

## Key Requirements for Synchronization

### 1. Use Observables for Synchronized Props

Only observables can synchronize with HTML attributes:

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

### 2. Specify Type Information

For proper type conversion, specify the `type` option:

```typescript
// ✅ Correct - with type information
function def() {
  return {
    count: $(0, { type: 'number' } as const),     // Converts "5" to 5
    enabled: $(false, { type: 'boolean' } as const), // Converts "true" to true
    data: $({} as any, { type: 'object' } as const)  // Converts JSON string to object
  }
}

// ❌ Incorrect - no type information
function def() {
  return {
    count: $(0),      // Will be treated as string
    enabled: $(true), // Will be treated as string
    data: $({})       // Will be treated as string
  }
}
```

### 3. Use defaults() Function

Always use the `defaults` function for proper synchronization:

```typescript
// ✅ Correct - with defaults
const Counter = defaults(def, (props: CounterProps): JSX.Element => {
  const { value } = props  // Enables synchronization
  // ...
})
// ❌ Incorrect - no defaults
const Counter = (props: CounterProps): JSX.Element => {
  const { value } = props  // No synchronization
  // ...
}
```

## Handling Different Prop Sources

### Props from Custom Elements (HTML attributes)

When a custom element is instantiated from HTML, the props come from parsed HTML attributes:

```html
<counter-element value="5" label="My Counter" obj='{"nested":{"text":"xyz"}}'></counter-element>
```

In this case:
- Props are created by parsing HTML string attributes
- The `defaults` function combines these parsed props with the defaults from `def()`
- HTML attributes take precedence over defaults

### Props from JSX/TSX Components

When a component is used directly in JSX/TSX:

```typescript
const App = () => {
  const count = $(10)
  return <Counter value={count} label="App Counter" />
}
```

In this case:
- Props are passed directly as JavaScript values
- The `defaults` function combines these props with the defaults from `def()`
- JSX props take precedence over defaults

### Inline Parameter Initialization Conflicts

Using inline parameter initialization can conflict with the `def()` pattern:

```typescript
// ❌ Potential conflict - inline initialization
const Counter = defaults(def, ({ value = $(0) }: CounterProps): JSX.Element => {
  // ...
})
// ✅ Recommended approach - use defaults
const Counter = defaults(def, (props: CounterProps): JSX.Element => {
  const { value } = props
  // ...
})
```

When inline parameters are used:
1. The inline default `$(0)` is applied before the defaults function processes the props
2. This can override the intended behavior from `def()`
3. Custom element synchronization may not work correctly

## Functions and Complex Objects

Functions and complex objects don't appear in HTML attributes and should not be expected to synchronize:

```typescript
interface ComponentProps {
  value: Observable<number>
  // Functions don't appear in HTML attributes - no synchronization
  increment: () => void
  decrement: () => void
  // Complex objects don't appear in HTML attributes - no synchronization
  callbacks: {
    onComplete: () => void
  }
}

function def() {
  return {
    value: $(0, { type: 'number' } as const),
    // Functions are not synchronized
    increment: () => {},
    decrement: () => {},
    // Complex objects are not synchronized
    callbacks: {
      onComplete: () => {}
    }
  }
}
```

For functions that need to be passed to custom elements, store them in observables using array notation:

```typescript
function def() {
  const value = $(0, { type: 'number' } as const)
  return {
    value,
    increment: $([() => { value($$(value) + 10) }], { toHtml: o => undefined }), //hide this from html attributes
  }
}
```

To store a function in an observable, use the array notation `$([() => { /* function body */ }])`. This allows functions to be passed as props to custom elements while keeping them hidden from HTML attributes when the `toHtml: o => undefined` option is used.

## Without Two-Way Synchronization

Components that don't use the `defaults` pattern will not have attribute synchronization:

```typescript
// ❌ No synchronization - attributes and props are not linked
const SimpleCounter = ({ value = $(0) }: { value?: Observable<number> }) => (
  <div>Count: {value}</div>
)

customElement('simple-counter', SimpleCounter)

// In HTML: <simple-counter value="5"></simple-counter>
// The value attribute will NOT be synchronized with the component prop
```

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

## Best Practices

1. **Always use the `defaults` pattern** for custom elements
2. **Specify type information** for non-string observables
3. **Use `as const`** with type options for better TypeScript inference
4. **Don't use inline parameter initialization** in custom elements
5. **Only functions and complex objects** should not be synchronized
6. **Test both HTML and JSX usage** to ensure proper synchronization
7. **Use `toHtml: () => undefined`** to hide functions from HTML attributes
8. **Use `toHtml` and `fromHtml`** for complex object serialization
9. **Store functions in observables using array notation** when they need to be passed to custom elements
10. **Properly augment JSX types** for full TypeScript support and IDE autocomplete
11. **Use descriptive JSDoc comments** in type augmentations for better documentation
12. **Include all custom elements** in your type augmentations for comprehensive type safety

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