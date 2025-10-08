# Simple Type Synchronization Between HTML Attributes and Component Props

This document explains the straightforward approach to synchronizing types between HTML string-only attributes and typed function component props in the Woby framework.

For a more detailed explanation of the type synchronization mechanism, see the [Type Synchronization Documentation](./Type-Synchronization.md).

## Overview

In web components, HTML attributes are always strings, but JavaScript/TypeScript components often need typed values (numbers, booleans, objects). The Woby framework provides a simple mechanism to automatically convert attribute strings to the appropriate types based on observable declarations.

## Basic Implementation

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

## How It Works

1. **Declaration**: When defining observables, specify the expected type using the `type` option
2. **Attribute Binding**: HTML attributes automatically bind to these typed observables
3. **Automatic Conversion**: The framework converts string attributes to the declared types

### Example Component

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

### HTML Usage

```
<!-- The framework automatically converts these string attributes -->
<my-counter value="5" disabled="false" label="My Counter"></my-counter>
```

In this example:
- `"5"` (string) gets converted to `5` (number)
- `"false"` (string) gets converted to `false` (boolean)
- `"My Counter"` remains as string

## Supported Types

The simple type synchronization supports these types:

| Type     | Conversion Rule                            | Example           |
|----------|--------------------------------------------|-------------------|
| number   | `Number(attributeValue)`                   | "42" → 42         |
| boolean  | `"true"/"1"/""` → `true`, otherwise false  | "false" → false   |
| string   | No conversion (default)                    | "text" → "text"   |
| object   | `JSON.parse(attributeValue)`               | '{"a":1}' → {a:1} |

## Key Benefits

1. **Automatic**: No manual parsing required in components
2. **Type-safe**: TypeScript knows the correct types
3. **Declarative**: Type information is declared with the observable
4. **Bidirectional**: Works for both HTML attributes and programmatic updates

## Best Practices

1. Always use `as const` with the type option for proper TypeScript inference:
   ```typescript
   $(0, { type: 'number' } as const) // ✅ Good
   $(0, { type: 'number' })          // ❌ Less precise typing
   ```

2. Declare all attributes that should participate in type synchronization with explicit types

3. Use sensible defaults that match your expected types

This simple approach eliminates the need for manual attribute parsing while maintaining full TypeScript type safety.