# Type Synchronization Between HTML Attributes and Component Props

This document explains how Woby synchronizes types between HTML string-only attributes and typed function component props, enabling seamless two-way binding for custom elements. It includes both a comprehensive approach and a simpler approach to type synchronization.

## Overview

In web components, HTML attributes are always strings, but JavaScript/TypeScript components often need typed values (numbers, booleans, objects). Woby provides mechanisms to automatically convert attribute strings to the appropriate types based on observable declarations.

This document covers both the comprehensive type synchronization mechanism and a simpler approach.

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

## HTML Attribute Serialization

Custom elements support custom serialization of observable values to and from HTML attributes using the `toHtml` and `fromHtml` options:

### Hiding Properties from HTML Attributes

To prevent a property from appearing in HTML attributes, use the `toHtml` option with a function that returns `undefined`:

```typescript
function def() {
  return {
    value: $(0, { type: 'number' } as const),
    increment: $([() => { value($$(value) + 10) }], { toHtml: o => undefined }), //hide this from html attributes
  }
}
```

### Object and Date Serialization

To serialize complex objects and dates to and from HTML attributes, use the `toHtml` and `fromHtml` options:

```typescript
function def() {
  return {
    obj: $({ nested: { text: 'abc' } }, { 
      toHtml: o => JSON.stringify(o), 
      fromHtml: o => JSON.parse(o) 
    }),
    date: $(new Date(), { 
      toHtml: o => o.toISOString(), 
      fromHtml: o => new Date(o) 
    })
  }
}
```

These serialization options allow complex JavaScript objects and Date instances to be properly converted to and from HTML attribute strings, enabling two-way synchronization between HTML attributes and component props.

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

```typescript
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
        const { type, fromHtml } = options ?? {}
        
        if (type) {
            switch (type) {
                case 'number':
                    obj[key](fromHtml ? fromHtml(value) : Number(value))
                    break
                case 'boolean':
                    // Handle various boolean representations
                    if (fromHtml) {
                        obj[key](fromHtml(value))
                    } else {
                        const lowerValue = value?.toLowerCase()
                        obj[key](lowerValue === 'true' || lowerValue === '1' || lowerValue === '')
                    }
                    break
                case 'bigint':
                    if (fromHtml) {
                        obj[key](fromHtml(value))
                    } else {
                        try {
                            obj[key](BigInt(value))
                        } catch (e) {
                            // If parsing fails, fallback to string
                            obj[key](value)
                        }
                    }
                    break
                case 'object':
                    if (fromHtml) {
                        obj[key](fromHtml(value))
                    } else {
                        try {
                            obj[key](JSON.parse(value))
                        } catch (e) {
                            // If parsing fails, fallback to string
                            obj[key](value)
                        }
                    }
                    break
                case 'function':
                    // For function types, we can't really convert from string
                    // This would typically be handled by the component itself
                    obj[key](fromHtml ? fromHtml(value) : value)
                    break
                case 'symbol':
                    // For symbol types, create a symbol from the string
                    obj[key](fromHtml ? fromHtml(value) : Symbol(value))
                    break
                case 'undefined':
                    obj[key](fromHtml ? fromHtml(value) : undefined)
                    break
                default:
                    // For constructor types or other custom types, treat as string
                    // since HTML attributes are always strings and we can't instantiate
                    // arbitrary constructors from strings
                    obj[key](fromHtml ? fromHtml(value) : value)
                    break
            }
        } else {
            obj[key](fromHtml ? fromHtml(value) : value)
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

```typescript
import { $, defaults, merge, customElement } from 'woby'
import type { Observable } from 'woby'

interface MyComponentProps {
  count?: Observable<number>
  enabled?: Observable<boolean>
  data?: Observable<{[key: string]: any}>
  label?: string  // Non-observable, treated as string
  obj?: Observable<{ nested: { text: string } }>
  date?: Observable<Date>
}

function def() {
  return {
    count: $(0, { type: 'number' } as const),
    enabled: $(true, { type: 'boolean' } as const),
    data: $({} as any, { type: 'object' } as const),
    label: $(''),
    obj: $({ nested: { text: 'abc' } }, { 
      toHtml: o => JSON.stringify(o), 
      fromHtml: o => JSON.parse(o) 
    }),
    date: $(new Date(), { 
      toHtml: o => o.toISOString(), 
      fromHtml: o => new Date(o) 
    })
  }
}

const MyComponent = defaults(def, (props: MyComponentProps): JSX.Element => {
  const mergedProps = merge(props, def())
  const { count, enabled, data, label, obj, date } = mergedProps
  
  return (
    <div>
      <p>Count: {count}</p>
      <p>Enabled: {enabled ? 'Yes' : 'No'}</p>
      <p>Data: {JSON.stringify(data)}</p>
      <p>Label: {label}</p>
      <p>Object: {() => JSON.stringify($$(obj))}</p>
      <p>Date: {() => $$(date).toString()}</p>
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
  label="My Component"
  obj='{"nested":{"text":"xyz"}}'
  date="2023-01-01T00:00:00.000Z">
</my-component>
```

In this example:
- `count="42"` becomes `count: $(42)` (number)
- `enabled="false"` becomes `enabled: $(false)` (boolean)
- `data='{"key":"value"}'` becomes `data: $({key: "value"})` (object)
- `label="My Component"` becomes `label: "My Component"` (string)
- `obj='{"nested":{"text":"xyz"}}'` becomes `obj: $({nested: {text: "xyz"}})` (object with custom serialization)
- `date="2023-01-01T00:00:00.000Z"` becomes `date: $(new Date("2023-01-01T00:00:00.000Z"))` (date with custom serialization)

## Best Practices

1. **Always Specify Types**: For non-string props, always use the `type` option in your defaults
2. **Use `as const`**: Cast type options to `as const` for better TypeScript inference
3. **Handle Edge Cases**: Consider what should happen with invalid values (e.g., `"not-a-number"` for a number type)
4. **Test Both Directions**: Verify that both HTML attribute changes and prop changes work correctly
5. **Use `merge(props, def())`**: Always use the merge pattern for proper handling of different prop sources
6. **Use `toHtml` and `fromHtml`**: For complex objects and dates, use these options for proper serialization
7. **Hide Functions from HTML**: Use `toHtml: () => undefined` to prevent functions from appearing in HTML attributes
8. **Store Functions in Array Notation**: Use `$([() => { /* function body */ }])` to store functions in observables for custom elements

## Simple Type Synchronization Approach

For those who prefer a more straightforward approach to type synchronization, Woby also provides a simpler mechanism.

### Basic Implementation

The simplest way to achieve type synchronization is by declaring observables with explicit type information using the `{ type: '...' }` option:

```typescript
const def = () => ({
  // Number type
  count: $(0, { type: 'number' } as const),
  
  // Boolean type
  enabled: $(true, { type: 'boolean' } as const),
  
  // String type (default)
  label: $('', { type: 'string' } as const),
  
  // Object type
  config: $({} as MyConfig, { type: 'object' } as const)
})
```

### How It Works

1. **Declaration**: When defining observables, specify the expected type using the `type` option
2. **Attribute Binding**: HTML attributes automatically bind to these typed observables
3. **Automatic Conversion**: The framework converts string attributes to the declared types

#### Example Component

```typescript
import { $, component, defaults } from 'woby'

const def = () => ({
  value: $(0, { type: 'number' } as const),
  disabled: $(false, { type: 'boolean' } as const),
  label: $('', { type: 'string' } as const)
})

const Counter = (props: ReturnType<typeof def>) => {
  const { value, disabled, label } = defaults(def, props)
  
  // value is typed as number
  // disabled is typed as boolean
  // label is typed as string
  
  return (
    <div>
      <span>{label}</span>
      <button disabled={disabled} onclick={() => value(prev => prev + 1)}>
        Count: {value}
      </button>
    </div>
  )
}

component('my-counter', Counter, def)
```

#### HTML Usage

```html
<!-- The framework automatically converts these string attributes -->
<my-counter value="5" disabled="false" label="My Counter"></my-counter>
```

In this example:
- `"5"` (string) gets converted to `5` (number)
- `"false"` (string) gets converted to `false` (boolean)
- `"My Counter"` remains as string

### Supported Types

The simple type synchronization supports these types:

| Type     | Conversion Rule                            | Example           |
|----------|--------------------------------------------|-------------------|
| number   | `Number(attributeValue)`                   | "42" → 42         |
| boolean  | `"true"/"1"/""` → `true`, otherwise false  | "false" → false   |
| string   | No conversion (default)                    | "text" → "text"   |
| object   | `JSON.parse(attributeValue)`               | '{"a":1}' → {a:1} |

### Key Benefits

1. **Automatic**: No manual parsing required in components
2. **Type-safe**: TypeScript knows the correct types
3. **Declarative**: Type information is declared with the observable
4. **Bidirectional**: Works for both HTML attributes and programmatic updates

### Best Practices

1. Always use `as const` with the type option for proper TypeScript inference:
   ```typescript
   $(0, { type: 'number' } as const) // ✅ Good
   $(0, { type: 'number' })          // ❌ Less precise typing
   ```

2. Declare all attributes that should participate in type synchronization with explicit types

3. Use sensible defaults that match your expected types

This simple approach eliminates the need for manual attribute parsing while maintaining full TypeScript type safety.

## Limitations

1. **Constructor Types**: Custom constructor types cannot be automatically instantiated from strings
2. **Function Types**: Functions cannot be meaningfully created from strings