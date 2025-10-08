# Type Synchronization Between HTML Attributes and Component Props

This document explains how Woby synchronizes types between HTML string-only attributes and typed function component props, enabling seamless two-way binding for custom elements.

## Overview

In web components, HTML attributes are always strings, but JavaScript/TypeScript components often need typed values (numbers, booleans, objects). Woby provides a sophisticated mechanism to automatically convert attribute strings to the appropriate types based on observable declarations.

For a simpler approach to type synchronization, see the [Simple Type Synchronization Guide](./Type-Sync-Simple.md).

For information about how the `merge` function handles different prop sources, see [Component Defaults](./Component-Defaults.md).

## How It Works

### 1. Typed Observables

The key to type synchronization is using typed observables in your default props:

```typescript
function def() {
  return {
    value: $(0, { type: 'number' } as const),     // Typed as number
    disabled: $(false, { type: 'boolean' } as const), // Typed as boolean
    label: $('', { type: 'string' } as const)     // Typed as string (default)
  }
}
```

### 2. Attribute to Prop Conversion

When an HTML attribute changes, Woby automatically converts the string value to the appropriate type based on the observable's type option:

```html
<!-- HTML -->
<my-counter value="5" disabled="true" label="Counter"></my-counter>
```

Conversion process:
- `value="5"` → `value: $(5)` (string "5" converted to number 5)
- `disabled="true"` → `disabled: $(true)` (string "true" converted to boolean true)
- `label="Counter"` → `label: $("Counter")` (string remains string)

### 3. Type Conversion Rules

Woby supports automatic conversion for several built-in types:

| Type Option | HTML Attribute | Converted Value | Notes |
|-------------|----------------|-----------------|-------|
| `'number'` | `"5"` | `5` | Uses `Number(value)` |
| `'boolean'` | `"true"`, `"1"`, `""` | `true` | Special handling |
| `'boolean'` | `"false"`, `"0"`, other | `false` | |
| `'bigint'` | `"123"` | `123n` | Uses `BigInt(value)` |
| `'object'` | `'{"a":1}'` | `{a:1}` | Uses `JSON.parse(value)` |
| `'string'` | `"text"` | `"text"` | No conversion (default) |
| `'undefined'` | `"any"` | `undefined` | Always converts to undefined |

### 4. Special Boolean Handling

Boolean conversion follows HTML standards:
- Truthy: `"true"`, `"1"`, or empty string `""`
- Falsy: `"false"`, `"0"`, or any other value

```html
<!-- All of these set disabled to $(true) -->
<my-element disabled="true"></my-element>
<my-element disabled="1"></my-element>
<my-element disabled=""></my-element>

<!-- All of these set disabled to $(false) -->
<my-element disabled="false"></my-element>
<my-element disabled="0"></my-element>
<my-element disabled="anything"></my-element>
```

## Handling Different Prop Sources

### Props from HTML Attributes

When props come from HTML attributes, they are always strings and must be converted to the appropriate types:

```html
<my-component count="42" enabled="false" data='{"key":"value"}'></my-component>
```

The conversion process:
1. String values are parsed from HTML attributes
2. Type information from observables determines conversion rules
3. Values are converted and set on observables

### Props from JSX/TSX

When props come from JSX/TSX, they are already typed JavaScript values:

```tsx
const App = () => {
  const count = $(42)
  const enabled = $(false)
  const data = $({key: "value"})
  
  return <MyComponent count={count} enabled={enabled} data={data} />
}
```

In this case:
1. Values are already properly typed
2. No conversion is needed
3. The `merge` function combines them with defaults appropriately

### Inline Parameter Initialization

Using inline parameter initialization can interfere with type synchronization:

```
// ❌ Potential issues with type synchronization
const MyComponent = defaults(def, ({ count = $(0) }: MyComponentProps): JSX.Element => {
  // The inline default $(0) may not have type information
  // This can cause issues with HTML attribute synchronization
  // ...
})
// ✅ Recommended approach
const MyComponent = defaults(def, (props: MyComponentProps): JSX.Element => {
  // The merge function properly handles type synchronization
  const mergedProps = merge(props, def())
  const { count } = mergedProps
  // ...
})
```

## Implementation Details

### In Custom Elements

The type conversion happens in the `setObservableValue` function in `custom_element.ts`:

```typescript
const setObservableValue = (obj: any, key: string, value: string) => {
    if (isObservable(obj[key])) {
        // Cast value according to observable options type
        const observable = obj[key] as Observable<any>
        const options = (observable[SYMBOL_OBSERVABLE_WRITABLE]).options as ObservableOptions<any> | undefined

        if (options?.type) {
            switch (options.type) {
                case 'number':
                    obj[key](Number(value))  // Convert string to number
                    break
                case 'boolean':
                    // Handle various boolean representations
                    const lowerValue = value?.toLowerCase()
                    obj[key](lowerValue === 'true' || lowerValue === '1' || lowerValue === '')
                    break
                // ... other type conversions
            }
        } else {
            obj[key](value)  // Default: treat as string
        }
    } else {
        obj[key] = value
    }
}
```

### In Component Defaults

When defining defaults, always specify the `type` option for non-string values:

```typescript
// ✅ Correct - with type information
function def() {
  return {
    count: $(0, { type: 'number' } as const),
    enabled: $(true, { type: 'boolean' } as const),
    data: $({} as any, { type: 'object' } as const)
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

## Complete Example

Here's a complete example showing type synchronization in action:

```
import { $, defaults, merge, customElement } from 'woby'
import type { Observable } from 'woby'

interface MyComponentProps {
  count?: Observable<number>
  enabled?: Observable<boolean>
  data?: Observable<{[key: string]: any}>
  label?: string  // Non-observable, treated as string
}

function def() {
  return {
    count: $(0, { type: 'number' } as const),
    enabled: $(true, { type: 'boolean' } as const),
    data: $({} as any, { type: 'object' } as const),
    label: $('')
  }
}

const MyComponent = defaults(def, (props: MyComponentProps): JSX.Element => {
  const mergedProps = merge(props, def())
  const { count, enabled, data, label } = mergedProps
  
  return (
    <div>
      <p>Count: {count}</p>
      <p>Enabled: {enabled ? 'Yes' : 'No'}</p>
      <p>Data: {JSON.stringify(data)}</p>
      <p>Label: {label}</p>
    </div>
  )
})

customElement('my-component', MyComponent)
```

Usage:

```html
<!-- HTML usage with automatic type conversion -->
<my-component 
  count="42" 
  enabled="false" 
  data='{"key":"value"}' 
  label="My Component">
</my-component>
```

In this example:
- `count="42"` becomes `count: $(42)` (number)
- `enabled="false"` becomes `enabled: $(false)` (boolean)
- `data='{"key":"value"}'` becomes `data: $({key: "value"})` (object)
- `label="My Component"` becomes `label: "My Component"` (string)

## Best Practices

1. **Always Specify Types**: For non-string props, always use the `type` option in your defaults
2. **Use `as const`**: Cast type options to `as const` for better TypeScript inference
3. **Handle Edge Cases**: Consider what should happen with invalid values (e.g., `"not-a-number"` for a number type)
4. **Test Both Directions**: Verify that both HTML attribute changes and prop changes work correctly
5. **Use `merge(props, def())`**: Always use the merge pattern for proper handling of different prop sources

## Limitations

1. **Constructor Types**: Custom constructor types cannot be automatically instantiated from strings
2. **Function Types**: Functions cannot be meaningfully created from strings