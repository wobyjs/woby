# Custom Element Practical Guide: From Basics to Advanced Patterns

This guide provides a practical, hands-on approach to creating custom elements in Woby, based on real-world examples and patterns demonstrated in the counter demo. It covers everything from basic setup to advanced features with detailed explanations and code examples.

## Table of Contents
1. [Introduction to Custom Elements](#introduction-to-custom-elements)
2. [Basic Custom Element Creation](#basic-custom-element-creation)
3. [The Defaults Pattern Explained](#the-defaults-pattern-explained)
4. [Handling Functions in Custom Elements](#handling-functions-in-custom-elements)
5. [Object and Date Serialization](#object-and-date-serialization)
6. [Context Propagation in Custom Elements](#context-propagation-in-custom-elements)
7. [Nested Properties Deep Dive](#nested-properties-deep-dive)
8. [Style Properties Handling](#style-properties-handling)
9. [HTML vs JSX Usage Patterns](#html-vs-jsx-usage-patterns)
10. [TypeScript Integration](#typescript-integration)
11. [Best Practices and Common Pitfalls](#best-practices-and-common-pitfalls)

## Introduction to Custom Elements

Custom elements in Woby are standard web components that can be used directly in HTML or JSX. They provide two-way synchronization between HTML attributes and component props, making them incredibly powerful for building reusable components.

Unlike ordinary React components, custom elements in Woby:
- Can be used directly in HTML without any JavaScript
- Automatically synchronize attributes with component props
- Handle type conversion between HTML strings and JavaScript values
- Support nested properties and complex data structures
- Integrate seamlessly with Woby's reactivity system

## Basic Custom Element Creation

Let's start with a simple counter component to understand the basics:

```typescript
import { $, customElement, defaults } from 'woby'

// Define the default props function
function def() {
    return {
        value: $(0, { type: 'number' } as const),
        title: $('Counter')
    }
}

// Create the component using defaults
const Counter = defaults(def, (props) => {
    const { value, title } = props
    
    const increment = () => value($$(value) + 1)
    const decrement = () => value($$(value) - 1)
    
    return (
        <div>
            <h2>{title}</h2>
            <p>Count: {value}</p>
            <button onClick={increment}>+</button>
            <button onClick={decrement}>-</button>
        </div>
    )
})

// Register as a custom element
customElement('simple-counter', Counter)
```

### Key Points:
1. **def() function**: Defines default props with proper type information
2. **defaults() wrapper**: Enables two-way synchronization
3. **Type annotations**: `{ type: 'number' }` ensures proper conversion
4. **customElement() registration**: Makes the component available as HTML element

## The Defaults Pattern Explained

The `defaults` pattern is crucial for custom elements. It's not just about providing default values—it's about enabling synchronization between HTML attributes and component props.

### Why Use Defaults?

```typescript
// ❌ Without defaults - no synchronization
const BadCounter = (props) => {
    // Props from HTML won't be converted properly
    // Changes to props won't update HTML attributes
}

// ✅ With defaults - full synchronization
const GoodCounter = defaults(def, (props) => {
    // Props from HTML are converted to proper types
    // Changes to props update HTML attributes
})
```

### How Defaults Works

The `defaults` function:
1. Takes a `def` function that returns default props
2. Takes a component function that receives merged props
3. Handles the merging of HTML attributes with default values
4. Manages two-way synchronization between props and attributes

```typescript
// The def function provides the structure and type information
function def() {
    return {
        // Observable with type information for synchronization
        count: $(0, { type: 'number' } as const),
        // Regular string (no synchronization needed)
        label: 'Counter',
        // Function hidden from HTML attributes
        increment: $([() => {}], { toHtml: o => undefined })
    }
}

// The component receives properly merged props
const Counter = defaults(def, (props) => {
    const { count, label, increment } = props
    // count is an observable number (converted from HTML string if needed)
    // label is a string
    // increment is a function array [function, observable]
})
```

## Handling Functions in Custom Elements

Functions present a unique challenge in custom elements because:
1. HTML attributes are always strings
2. Functions cannot be serialized to strings and back
3. Functions need to work in both HTML and JSX contexts

### The Array Notation Solution

```typescript
function def() {
    const value = $(0, { type: 'number' } as const)
    return {
        value,
        // Store function in observable array to hide it from HTML attributes
        increment: $([() => { value($$(value) + 1) }], { toHtml: o => undefined })
    }
}

const Counter = defaults(def, (props) => {
    const { value, increment: inc } = props
    // Access the function from the observable array
    const increment = $$(inc)[0]
    
    return (
        <div>
            <p>Value: {value}</p>
            <button onClick={increment}>+</button>
        </div>
    )
})
```

### Why This Pattern?

1. **Array Storage**: `$([function])` stores the function in an observable array
2. **HTML Hiding**: `{ toHtml: o => undefined }` prevents the function from appearing in HTML attributes
3. **Access Pattern**: `$$(observable)[0]` retrieves the function from the array

## Object and Date Serialization

Complex objects and dates require special handling for HTML attribute synchronization:

### Object Serialization

```typescript
function def() {
    return {
        // Object with custom serialization
        config: $({ theme: 'light', size: 'medium' }, { 
            toHtml: o => JSON.stringify(o), 
            fromHtml: o => JSON.parse(o) 
        })
    }
}

const Component = defaults(def, (props) => {
    const { config } = props
    // config is an observable containing the parsed object
    
    return (
        <div>
            <p>Theme: {$$(config).theme}</p>
            <p>Size: {$$(config).size}</p>
        </div>
    )
})
```

### Date Serialization

```typescript
function def() {
    return {
        // Date with custom serialization
        createdAt: $(new Date(), { 
            toHtml: o => o.toISOString(), 
            fromHtml: o => new Date(o) 
        })
    }
}

const Component = defaults(def, (props) => {
    const { createdAt } = props
    // createdAt is an observable containing a Date object
    
    return (
        <div>
            <p>Created: {$$(createdAt).toString()}</p>
        </div>
    )
})
```

### Serialization Options Explained

- **toHtml**: Converts the JavaScript value to a string for HTML attributes
- **fromHtml**: Converts the HTML attribute string back to a JavaScript value
- **Both required**: For proper two-way synchronization

## Context Propagation in Custom Elements

Custom elements automatically propagate context to child elements, but require special handling:

### Creating Context

```typescript
import { createContext, useContext } from 'woby'

// Create a context
const CounterContext = createContext(0)

// Custom hook for using the context
const useCounterContext = () => useContext(CounterContext)
```

### Using Context in Custom Elements

```typescript
const ContextValue = defaults(() => ({}), (props) => {
    // Use useMountedContext for proper context propagation in custom elements
    const context = useMountedContext(CounterContext)
    
    return <span>Context Value: {context}</span>
})

customElement('context-value', ContextValue)
```

### Providing Context

```typescript
const Counter = defaults(def, (props) => {
    const { value, title } = props
    
    return (
        <div>
            <h2>{title}</h2>
            <p>Value: {value}</p>
            {/* Provide context to children */}
            <CounterContext.Provider value={value}>
                {props.children}
            </CounterContext.Provider>
        </div>
    )
})
```

### Context Propagation in HTML

```html
<!-- Parent counter provides context -->
<counter-element value="5">
    <!-- Child can access parent's context -->
    <context-value></context-value>
    <!-- Nested counter can also access context -->
    <counter-element>
        <context-value></context-value>
    </counter-element>
</counter-element>
```

## Nested Properties Deep Dive

Nested properties allow you to organize related props in a structured way:

### Defining Nested Properties

```typescript
function def() {
    return {
        value: $(0, { type: 'number' } as const),
        // Nested configuration object
        config: {
            theme: $('light'),
            limits: {
                min: $(-10, { type: 'number' } as const),
                max: $(100, { type: 'number' } as const)
            }
        }
    }
}
```

### HTML Usage Patterns

In HTML, nested properties can be accessed using two notations:

```html
<!-- Dot notation -->
<counter-element 
    config.theme="dark" 
    config.limits.min="-50" 
    config.limits.max="200">
</counter-element>

<!-- Alternative notation (also works) -->
<counter-element 
    config-theme="dark" 
    config-limits-min="-50" 
    config-limits-max="200">
</counter-element>
```

### JSX Usage Patterns

In JSX, nested properties use the dash notation:

```tsx
<counter-element 
    config-theme="dark" 
    config-limits-min={-50}
    config-limits-max={200}>
</counter-element>
```

### Component Implementation

```typescript
const Counter = defaults(def, (props) => {
    const { value, config } = props
    
    return (
        <div className={`counter counter-${$$($$(config)?.theme)}`}>
            <p>Value: {value}</p>
            <p>Min: {$$($$($$(config)?.limits)?.min)}</p>
            <p>Max: {$$($$($$(config)?.limits)?.max)}</p>
        </div>
    )
})
```

## Style Properties Handling

Style properties have special handling for both HTML and JSX usage:

### HTML Style Properties

```html
<!-- Dot notation for styles -->
<counter-element 
    style.color="red" 
    style.font-size="1.5em"
    style.background-color="lightblue">
</counter-element>

<!-- Alternative notation -->
<counter-element 
    style$color="red" 
    style$font-size="1.5em"
    style$background-color="lightblue">
</counter-element>
```

### JSX Style Properties

```tsx
<counter-element 
    style$color="red" 
    style$font-size="1.5em"
    style$background-color="lightblue">
</counter-element>
```

### Component Implementation

```typescript
const Counter = defaults(def, (props) => {
    const { ...restProps } = props
    
    return (
        <div {...restProps} style={{ border: '1px solid red' }}>
            {/* Content */}
        </div>
    )
})
```

## HTML vs JSX Usage Patterns

Custom elements work differently in HTML versus JSX contexts:

### HTML Usage (String Attributes)

```html
<!-- All attributes are strings in HTML -->
<counter-element 
    value="5" 
    disabled="true"
    obj='{"nested":{"text":"abc"}}'
    date="2023-01-01T00:00:00.000Z">
</counter-element>
```

### JSX Usage (JavaScript Values)

```tsx
// In JSX, you can pass JavaScript values directly
<counter-element 
    value={$(5, { type: 'number' as const })} 
    disabled={$(true, { type: 'boolean' as const })}
    obj={$({ nested: { text: 'abc' } }, { 
        toHtml: o => JSON.stringify(o), 
        fromHtml: o => JSON.parse(o) 
    })}
    date={$(new Date(), { 
        toHtml: o => o.toISOString(), 
        fromHtml: o => new Date(o) 
    })}>
</counter-element>
```

### Key Differences

| Aspect | HTML Usage | JSX Usage |
|--------|------------|-----------|
| Attribute Types | Always strings | JavaScript values |
| Type Conversion | Automatic | Direct usage |
| Function Props | Not supported | Supported |
| Complex Objects | Requires serialization | Direct observables |

## TypeScript Integration

Proper TypeScript integration ensures type safety and better developer experience:

### Extending JSX Namespace

```typescript
// Extend JSX namespace for TypeScript support
declare module 'woby' {
    namespace JSX {
        interface IntrinsicElements {
            'counter-element': ElementAttributes<typeof Counter>
            'context-value': ElementAttributes<typeof ContextValue>
        }
    }
}
```

### Type Definitions

```typescript
import type { ObservableReadonly } from 'soby'

interface CounterProps {
    value?: ObservableReadonly<number>
    title?: ObservableReadonly<string>
    disabled?: ObservableReadonly<boolean>
    obj?: ObservableReadonly<{ nested: { text: string } }>
    date?: ObservableReadonly<Date>
    increment?: ObservableReadonly<readonly [() => void]>
}
```

### Using Types in Components

```typescript
const Counter = defaults(def, (props: CounterProps) => {
    const {
        value,
        title,
        disabled,
        obj,
        date,
        increment: inc
    } = props
    
    // TypeScript provides proper type checking for all props
})
```

## Best Practices and Common Pitfalls

### Best Practices

1. **Always use `defaults`** for custom elements
2. **Provide type information** for non-string observables
3. **Hide functions from HTML** using `toHtml: o => undefined`
4. **Use proper serialization** for complex objects and dates
5. **Extend JSX namespace** for TypeScript support
6. **Use `useMountedContext`** for context in custom elements
7. **Organize props with nested objects** for better structure
8. **Test both HTML and JSX usage** to ensure compatibility

### Common Pitfalls

1. **Not using `defaults`** - Breaks synchronization
2. **Missing type information** - Causes incorrect type conversion
3. **Functions in HTML attributes** - Won't work as expected
4. **Complex objects without serialization** - Won't sync properly
5. **Regular `useContext` instead of `useMountedContext`** - Context won't propagate
6. **Inline parameter defaults** - Can conflict with `def()` pattern

### Pitfall Examples

```typescript
// ❌ Missing type information
function def() {
    return {
        value: $(0) // Will be treated as string
    }
}

// ✅ With type information
function def() {
    return {
        value: $(0, { type: 'number' } as const) // Will be treated as number
    }
}

// ❌ Functions in HTML attributes
function def() {
    return {
        increment: $([() => {}]) // Will appear as "[object Object]" in HTML
    }
}

// ✅ Functions hidden from HTML
function def() {
    return {
        increment: $([() => {}], { toHtml: o => undefined }) // Hidden from HTML
    }
}
```

## Complete Example: Advanced Counter

Here's a complete example that demonstrates all the concepts:

```typescript
import { 
    $, $$, useMemo, customElement, createContext, 
    useContext, defaults, useMountedContext, type ElementAttributes 
} from 'woby'
import type { ObservableReadonly } from 'soby'

// Create context
const CounterContext = createContext(0)

// Define defaults
function def() {
    const value = $(0, { type: 'number' } as const)
    return {
        value,
        title: $('Counter'),
        disabled: $(false, { type: 'boolean' } as const),
        increment: $([() => { value($$(value) + 1) }], { toHtml: o => undefined }),
        config: {
            theme: $('light'),
            step: $(1, { type: 'number' } as const)
        },
        metadata: $({ createdAt: new Date() }, { 
            toHtml: o => JSON.stringify(o), 
            fromHtml: o => JSON.parse(o) 
        })
    }
}

// Create component
const Counter = defaults(def, (props) => {
    const { value, title, disabled, increment: inc, config, metadata } = props
    
    const increment = $$(inc)[0]
    const decrement = () => value($$(value) - $$(config.step))
    
    const displayValue = useMemo(() => {
        return `${$$($$(config)?.theme)}: ${$$(value)}`
    })
    
    return (
        <div className={`counter counter-${$$($$(config)?.theme)}`}>
            <h2>{title}</h2>
            <p>Value: {displayValue}</p>
            <p>Created: {$$(metadata).createdAt.toString()}</p>
            <p>Context: {useMountedContext(CounterContext)}</p>
            <button disabled={disabled} onClick={increment}>+</button>
            <button disabled={disabled} onClick={decrement}>-</button>
            <CounterContext.Provider value={value}>
                {props.children}
            </CounterContext.Provider>
        </div>
    )
})

// Register custom element
customElement('advanced-counter', Counter)

// Extend JSX namespace
declare module 'woby' {
    namespace JSX {
        interface IntrinsicElements {
            'advanced-counter': ElementAttributes<typeof Counter>
        }
    }
}
```

This comprehensive guide covers all the essential aspects of creating custom elements in Woby, from basic concepts to advanced patterns, with detailed explanations and practical examples.