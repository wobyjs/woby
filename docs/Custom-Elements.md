## Custom Elements (customElement)

Create custom HTML elements that can be used as components with support for nested object properties.

### Overview

The `customElement` function registers a component as a standard web component that can be used directly in HTML or JSX. It now supports nested object properties through dash-separated attribute names, allowing for more organized and structured component APIs.

The function signature has been updated to swap the parameter positions and make the attributes parameter optional with a default value of `['*']`.

### Context Integration

Custom elements automatically propagate context values from parent to child elements, enabling `useMountedContext` to work seamlessly with HTML-defined custom elements.

When a custom element is used as a child of another custom element, the parent's context is automatically made available to the child through the `useMountedContext` hook:

```html
<!-- Parent custom element provides context -->
<counter-element value="5">
  <!-- Child custom element can access parent's context -->
  <counter-element></counter-element>
</counter-element>
```

This works without requiring explicit Provider components, making context sharing in HTML much simpler than with traditional React context.

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
- `['style-*']` - Observe all attributes that start with "style-"
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
<my-counter value="5" style-color="red"></my-counter>
```

For this to work effectively, components should provide sensible default values for all props.

You can also use nested properties directly in HTML:

```html
<!-- Works without any JavaScript -->
<counter-element 
  style-color="blue" 
  style-font-size="1.5em" 
  nested-nested-text="xyz"
  class="border-2 border-black border-solid bg-amber-400">
</counter-element>
```

To enable direct HTML embedding, make sure to place the custom element before the script tag that loads your JavaScript:

```html
<body>
  <counter-element style-color="blue" style-font-size="1.5em" nested-nested-text="xyz"
      class="border-2 border-black border-solid bg-amber-400">
  </counter-element>
  <div id="app"></div>
  <script type="module" src="./index.tsx"></script>
</body>
```

### Basic Example

```typescript
import { $, customElement } from 'woby'

// Simple component with default values
const SimpleCounter = ({ value = 0 }: { value?: number }) => {
  return <div>Count: {value}</div>
}

// Register as custom element with default wildcard pattern
customElement('simple-counter', SimpleCounter)

// Usage in JSX
// <simple-counter value="5"></simple-counter>

// Usage in HTML
// <simple-counter value="5"></simple-counter>
```

### Wildcard Pattern Example

```typescript
import { $, customElement } from 'woby'

// Component with specific attribute patterns
const StyledCounter = ({ 
  value,
  style
}: { 
  value: number,
  style: {
    color: string,
    fontSize: string
  }
}) => {
  return (
    <div style={{ color: style.color, fontSize: style.fontSize }}>
      Count: {value}
    </div>
  )
}

// Register with specific patterns
customElement('styled-counter', StyledCounter, 'value', 'style-*')

// Usage
// <styled-counter 
//   value="5" 
//   style-color="red" 
//   style-fontSize="20px">
// </styled-counter>
```

### Nested Properties Example

```typescript
import { $, customElement } from 'woby'

// Component with nested props
const ThemedCounter = ({ 
  value,
  config,
  actions
}: { 
  value: number,
  config: {
    theme: string,
    size: string
  },
  actions: {
    increment: () => void
  }
}) => {
  return (
    <div class={`counter counter-${config.theme} counter-${config.size}`}>
      <span>Count: {value}</span>
      <button onClick={actions.increment}>+</button>
    </div>
  )
}

// Register with nested attributes
customElement('themed-counter', ThemedCounter,
  'value',
  'config-theme',
  'config-size',
  'actions-increment'
)

// Usage
// <themed-counter 
//   value="5" 
//   config-theme="dark" 
//   config-size="large"
//   actions-increment="handleIncrement">
// </themed-counter>
```

### Observable Integration

Nested properties work seamlessly with observables:

```typescript
import { $, $, customElement, useMemo } from 'woby'

const ObservableCounter = ({ 
  value,
  config
}: { 
  value: Observable<number>,
  config: {
    step: Observable<number>,
    min: number,
    max: number
  }
}) => {
  const displayValue = useMemo(() => {
    return `Value: ${$(value)}, Step: ${$(config.step)}`
  })
  
  return <div>{displayValue}</div>
}

customElement('observable-counter', ObservableCounter,
  'value',
  'config-step',
  'config-min',
  'config-max'
)
```

### TypeScript Support

For full TypeScript support, declare the custom element in the JSX namespace:

```typescript
import { customElement, ElementAttributes } from 'woby'

const MyComponent = ({ config }: { config: { theme: string } }) => {
  return <div>Theme: {config.theme}</div>
}

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

### Limitations

1. Property names with dashes in the actual property name are not supported
2. Very deeply nested properties may have slight performance overhead

### Related Resources

- [Nested Properties Demo](./demos/Nested-Properties-Demo.md) - Complete example with nested properties
- [Counter Demo](./demos/Counter-Demo.md) - Basic custom element usage