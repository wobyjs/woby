## Custom Elements (customElement)

Create custom HTML elements that can be used as components with support for nested object properties and improved attribute handling.

### Overview

The `customElement` function registers a component as a standard web component that can be used directly in HTML or JSX. It now supports nested object properties through dash-separated attribute names, allowing for more organized and structured component APIs.

The function signature has been updated to swap the parameter positions and make the attributes parameter optional with a default value of `['*']`.

For proper two-way synchronization between HTML attributes and component props, components should be wrapped with the `defaults` function.

For a complete guide on best practices for custom elements, see [Custom Element Best Practices](./Custom-Element-Best-Practices.md).

For information about how HTML string attributes are automatically converted to typed component props, see the [Type Synchronization Documentation](./Type-Synchronization.md).

### Important: Differences from Ordinary Components

Custom elements have important differences from ordinary functional components:

1. **Props Initialization**: Custom elements must use the `defaults` pattern, not inline parameter initialization
2. **Two-Way Synchronization**: Custom elements require observables for props that need to synchronize with HTML attributes
3. **Type Information**: Custom elements need explicit type information for proper attribute conversion
4. **Defaults Pattern**: Custom elements must use `defaults(def, component)` for proper synchronization

See [Custom Element Best Practices](./Custom-Element-Best-Practices.md) for detailed explanations and examples.

### Handling Different Prop Sources

Custom elements can receive props from different sources, and the `defaults` function properly handles each case:

1. **Props from HTML attributes**: String values are parsed and converted to appropriate types
2. **Props from JSX/TSX**: JavaScript values are used directly
3. **Props with inline parameters**: Can conflict with the `def()` pattern if not carefully written

The `defaults` function ensures that props from any source are properly combined with defaults for consistent behavior.

For more details on how different prop sources are handled, see [Component Defaults](./Component-Defaults.md).

### Context Integration

Custom elements automatically propagate context values from parent to child elements, enabling `useContext` to work seamlessly with HTML-defined custom elements.

When a custom element is used as a child of another custom element, the parent's context is automatically made available to the child through the `useContext` hook:

```html
<!-- Parent custom element provides context -->
<counter-element value="5">
  <!-- Child custom element can access parent's context -->
  <counter-element></counter-element>
</counter-element>
```

This works without requiring explicit Provider components, making context sharing in HTML much simpler than with traditional React context.

#### Context Usage Patterns

When using context in custom elements, there are two main patterns:

1. **Direct usage**: When you only need the context value for rendering, you can use `useMountedContext` directly (mount is auto taken care of)
2. **Manual mounting**: When you need to process the context value or perform other operations, you must manually include the mounting element `{m}` in your JSX

The output of context usage in JSX looks like:

```tsx
<context-value><span>(Context Value = <b>0<!----></b>)</span></context-value>
<span>(Context Value = <b>0<!----></b>)</span>
```

Note that `<Counter>` components cannot be used directly in HTML, only custom elements can be used in HTML.

### HTML Attribute Serialization

Custom elements support custom serialization of observable values to and from HTML attributes using the `toHtml` and `fromHtml` options:

#### Hiding Properties from HTML Attributes

To prevent a property from appearing in HTML attributes, use the `toHtml` option with a function that returns `undefined`:

```tsx
const Counter = defaults(() => {
  const value = $(0, { type: 'number' as const })
  return {
    value,
    increment: $([() => { value($$(value) + 10) }], { toHtml: o => undefined }), //hide this from html attributes
  }
}), ({ value, increment }) => (
  <div>
    <p>Count: {value}</p>
    <button onClick={() => increment[0]()}>+</button>
  </div>
))

customElement('counter-element', Counter)
```

#### Object and Date Serialization

To serialize complex objects and dates to and from HTML attributes, use the `toHtml` and `fromHtml` options:

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

customElement('my-component', Component)
```

### Function Properties

Functions can be stored in observables using array notation. This is particularly useful for custom elements where you want to pass functions as props:

```tsx
const Counter = defaults(() => {
  const value = $(0, { type: 'number' as const })
  return {
    value,
    increment: $([() => { value($$(value) + 10) }], { toHtml: o => undefined }), //hide this from html attributes
  }
}), ({ value, increment }) => (
  <div>
    <p>Count: {value}</p>
    <button onClick={() => increment[0]()}>+</button>
  </div>
))

customElement('counter-element', Counter)
```

To store a function in an observable, use the array notation `$([() => { /* function body */ }])`. This allows functions to be passed as props to custom elements while keeping them hidden from HTML attributes when the `toHtml: o => undefined` option is used.

### HTML vs JSX Usage

Custom elements behave differently when used in HTML versus JSX/TSX:

#### HTML Usage

In HTML, all attributes are strings and must be converted to appropriate types:

```html
<!-- All attributes are strings in HTML -->
<my-component 
  value="5" 
  obj='{"nested":{"text":"abc"}}'
  date="2023-01-01T00:00:00.000Z">
</my-component>
```

In HTML, you cannot directly declare observables with `$()`, so you must use the `def()` function pattern in your component definition. All attributes in HTML are treated as observables in the `<my-component>` if they are defined in the `def()` function with proper type information. No way to declare `$()` in HTML, so use `def()`, which means objects will appear as attributes.

#### JSX/TSX Usage

In JSX/TSX, you can pass JavaScript values directly:

```tsx
// In JSX/TSX, you can pass JavaScript values directly
const App = () => {
  return (
    <my-component 
      value={$(5, { type: 'number' as const })} 
      obj={$({ nested: { text: 'abc' } }, { 
        toHtml: o => JSON.stringify(o), 
        fromHtml: o => JSON.parse(o) 
      })}
      date={$(new Date(), { 
        toHtml: o => o.toISOString(), 
        fromHtml: o => new Date(o) 
      })}>
    </my-component>
  )
}
```

In JSX/TSX, when a statement is declared in `<my-component>` it won't appear in HTML attributes unless it's explicitly defined as an observable with `toHtml/fromHtml` options.

#### Key Differences

1. **In HTML**: All attributes are strings and require type conversion. In fact, all attributes in HTML are observables in `<my-component>` if not, they can't sync.
2. **In JSX/TSX**: Values can be JavaScript objects, observables, or primitives
3. **Two-way synchronization**: Only works with observables that have appropriate type information
4. **Function properties**: Cannot be passed in HTML, only in JSX/TSX
5. **Hidden properties**: Properties with `toHtml: () => undefined` won't appear in HTML attributes

#### Conditional Attribute Display

When using custom elements in JSX/TSX, properties defined with observables will appear as HTML attributes:

```tsx
// This will appear in HTML attributes because it's an observable with toHtml/fromHtml
<my-component 
  obj={$({ nested: { text: 'this obj will be serialized and deserialized to html attribute' } }, { 
    toHtml: obj => JSON.stringify(obj), 
    fromHtml: obj => JSON.parse(obj) 
  })}>
</my-component>

// This will NOT appear in HTML attributes because it's not explicitly defined as an observable
<my-component 
  obj={{ nested: { text: 'this obj will not sync/display to html attributes' } }}>
</my-component>
```

In HTML, `obj='{"name": "John", "age": 30}'` is already treated as an observable in `<my-component>` if it's defined in the `def()` function. In JSX/TSX, `<my-component>` attributes will be displayed and wrapped in the element, behaving like in HTML. However, for `<MyComponent>` (the component itself, not the custom element), children/innerHTML/content won't be wrapped in `<my-component>`. All attributes can be defined with or without `$()`, but only those with `$()` will appear in attributes for two-way sync in `<my-component>` only. For `<MyComponent>`, attributes won't sync unless specifically designed/defined in the component's return statement.

### Syntax

```typescript
customElement<P>(
  tagName: string, 
  component: JSX.Component<P>,
  ...attributes: ElementAttributePattern<P>[]
): void
```

### Parameters

- `tagName`: The HTML tag name for the custom element (must contain a hyphen)
- `component`: The component function to render
- `attributes`: Rest parameter of attribute patterns to observe (supports wildcards)

### Wildcard Support

The `attributes` parameter now supports wildcard patterns:

- `['*']` - Observe all attributes (default)
- `['style.*']` - Observe all attributes that start with "style."
- `['value', 'config-*']` - Observe the "value" attribute and all attributes that start with "config-"

### Nested Properties Support

The enhanced `customElement` function now supports nested object properties through dash-separated attribute names:

- Attribute `config-theme` maps to `props.config.theme`
- Attribute `user-profile-name` maps to `props.user.profile.name`
- Attribute `actions-onClick` maps to `props.actions.onClick`

### Direct HTML Embedding

Custom elements can be embedded directly in HTML files without requiring JavaScript initialization. Components with default prop values can work immediately when placed in HTML:

```html
<!-- Works without any JavaScript -->
<my-counter value="5" style.color="red"></my-counter>
```

For this to work effectively, components should provide sensible default values for all props and use the `defaults` pattern for proper attribute synchronization.

You can also use nested properties directly in HTML:

```html
<!-- Works without any JavaScript -->
<counter-element 
  style.color="blue" 
  style.font-size="1.5em" 
  nested.nested.text="xyz"
  class="border-2 border-black border-solid bg-amber-400">
</counter-element>
```

To enable direct HTML embedding, make sure to place the custom element before the script tag that loads your JavaScript:

```html
<body>
  <counter-element style.color="blue" style.font-size="1.5em" nested.nested.text="xyz"
      class="border-2 border-black border-solid bg-amber-400">
  </counter-element>
  <div id="app"></div>
  <script type="module" src="./index.tsx"></script>
</body>
```

### Basic Example

```typescript
import { $, customElement, defaults } from 'woby'

// Component props interface
interface CounterProps {
  value?: Observable<number>
  label?: string
}

// Default props function - required for custom elements
function def() {
  return {
    value: $(0, { type: 'number' } as const),  // Typed observable for synchronization
    label: 'Counter'
  }
}

// Component using defaults pattern
const Counter = defaults(def, (props: CounterProps): JSX.Element => {
  // The merge functionality is handled internally by the defaults function
  const { value, label } = props
  
  return (
    <div>
      <span>{label}: </span>
      <span>{value}</span>
    </div>
  )
})

// Register as custom element
customElement('counter-element', Counter)

// Usage in JSX
// <counter-element value={$(5)} label="My Counter"></counter-element>

// Usage in HTML (with two-way attribute synchronization)
// <counter-element value="5" label="My Counter"></counter-element>
```

### Wildcard Pattern Example

```typescript
import { $, customElement, defaults } from 'woby'

// Component with specific attribute patterns
interface StyledCounterProps {
  value: Observable<number>
  style: {
    color: string
    fontSize: string
  }
  label: string
}

function def() {
  return {
    value: $(0, { type: 'number' as const }),
    style: {
      color: 'black',
      fontSize: '16px'
    },
    label: 'Counter'
  }
}

const StyledCounter = defaults(def, (props: StyledCounterProps): JSX.Element => {
  const { value, style, label } = props
  
  return (
    <div style={{ color: style.color, fontSize: style.fontSize }}>
      <span>{label}: </span>
      <span>{value}</span>
    </div>
  )
})

// Register with specific patterns
customElement('styled-counter', StyledCounter, 'value', 'style.*', 'label')

// Usage
// <styled-counter 
//   value="5" 
//   style.color="red" 
//   style.font-size="20px"
//   label="My Counter">
```

### Nested Properties Example

```typescript
import { $, customElement, defaults } from 'woby'

// Component with nested props
interface ThemedCounterProps {
  value: Observable<number>
  config: {
    theme: string
    size: string
  }
  actions: {
    increment: () => void
  }
  label: string
}

function def() {
  return {
    value: $(0, { type: 'number' as const }),
    config: {
      theme: 'light',
      size: 'medium'
    },
    actions: {
      increment: () => {}
    },
    label: 'Counter'
  }
}

const ThemedCounter = defaults(def, (props: ThemedCounterProps): JSX.Element => {
  const { value, config, actions, label } = props
  
  return (
    <div class={`counter counter-${config.theme} counter-${config.size}`}>
      <span>{label}: </span>
      <span>{value}</span>
      <button onClick={actions.increment}>+</button>
    </div>
  )
})

// Register with nested attributes
customElement('themed-counter', ThemedCounter,
  'value',
  'config.theme',
  'config.size',
  'actions.increment',
  'label'
)

// Usage
// <themed-counter 
//   value="5" 
//   config.theme="dark" 
//   config.size="large"
//   actions.increment="handleIncrement"
//   label="My Counter">
// </themed-counter>
```

### Observable Integration

Nested properties work seamlessly with observables when using the `defaults` pattern:

```typescript
import { $, $$, customElement, useMemo, defaults } from 'woby'

interface ObservableCounterProps {
  value: Observable<number>
  config: {
    step: Observable<number>
    min: number
    max: number
  }
  label: string
}

function def() {
  return {
    value: $(0, { type: 'number' as const }),
    config: {
      step: $(1, { type: 'number' as const }),
      min: 0,
      max: 100
    },
    label: 'Counter'
  }
}

const ObservableCounter = defaults(def, (props: ObservableCounterProps): JSX.Element => {
  const { value, config, label } = props
  
  const displayValue = useMemo(() => {
    return `${label}: ${$(value)}, Step: ${$(config.step)}`
  })
  
  return <div>{displayValue}</div>
})

customElement('observable-counter', ObservableCounter,
  'value',
  'config-step',
  'config-min',
  'config-max',
  'label'
)
```

### Two-Way Synchronization

When components are properly wrapped with `defaults`, HTML attributes and component props are synchronized in both directions:

1. **HTML Attributes → Component Props**: When a custom element is used in HTML, attributes are automatically converted to component props
2. **Component Props → HTML Attributes**: When props change programmatically, the corresponding HTML attributes are updated

This synchronization is implemented in `@woby/woby/src/methods/defaults.ts` and requires the specific pattern shown in the examples above. For detailed information, see the [Component Defaults](./Component-Defaults.md) documentation.

### Functions and Complex Objects

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
    value: $(0, { type: 'number' as const }),
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

### TypeScript Support

For full TypeScript support, declare the custom element in the JSX namespace:

```typescript
import { customElement, ElementAttributes } from 'woby'

interface MyComponentProps {
  config: { theme: string }
}

const MyComponent = defaults(def, (props: MyComponentProps): JSX.Element => {
  const { config } = props
  return <div>Theme: {config.theme}</div>
})

customElement('my-component', MyComponent, 'config-theme')

// TypeScript declaration
declare module 'woby' {
  namespace JSX {
    interface IntrinsicElements {
      'my-component': ElementAttributes<typeof MyComponent>
    }
  }
}
```

### Best Practices

1. **Use Logical Grouping**: Group related properties under meaningful parent objects
2. **Avoid Over-Nesting**: Keep nesting levels reasonable for readability
3. **Maintain Consistent Naming**: Use consistent naming conventions for related properties
4. **Combine with TypeScript**: Use TypeScript interfaces to clearly define the nested structure
5. **Use Wildcards Wisely**: Use wildcard patterns when you want to observe many attributes without explicitly listing them
6. **Implement Two-Way Synchronization**: Use the `defaults` pattern for proper attribute synchronization
7. **Provide Sensible Defaults**: Always provide default values for all props to enable HTML usage
8. **Use Typed Observables**: Always specify the `type` option for non-string observables
9. **Don't Use Inline Initialization**: Custom elements must use the `def` pattern, not inline parameter defaults
10. **Use `toHtml` and `fromHtml` for Complex Serialization**: For objects and dates, use these options for proper serialization
11. **Hide Functions from HTML**: Use `toHtml: () => undefined` to prevent functions from appearing in HTML attributes

For a comprehensive guide to these best practices, see [Custom Element Best Practices](./Custom-Element-Best-Practices.md).

### Limitations

1. Property names with dashes in the actual property name are not supported
2. Very deeply nested properties may have slight performance overhead
3. Without the `defaults` pattern, attributes and props are not synchronized
4. Functions and complex objects don't appear in HTML attributes and won't synchronize
5. Primitive values from HTML attributes won't sync back to the component without observables

### Related Resources

- [Custom Element Best Practices](./Custom-Element-Best-Practices.md) - Complete guide to best practices
- [Nested Properties Demo](./demos/Nested-Properties-Demo.md) - Complete example with nested properties
- [Counter Demo](./demos/Counter-Demo.md) - Basic custom element usage
- [Component Defaults](./Component-Defaults.md) - Detailed documentation on the `defaults` function