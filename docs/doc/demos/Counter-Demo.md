# Counter Demo: Complete Guide to Custom Elements in Woby

This document provides a comprehensive walkthrough of creating custom elements in Woby using the Counter demo as a practical example. It covers all aspects of custom element creation, from basic setup to advanced features like context propagation and serialization.

## Overview

The Counter demo showcases several important concepts:
1. Custom element creation with proper defaults
2. HTML attribute serialization using `toHtml` and `fromHtml` options
3. Function storage in observables using array notation
4. Object and Date serialization
5. Context usage in custom elements
6. Differences between HTML and JSX usage of custom elements

## Complete Example Breakdown

### Component Definition

```typescript
import { $, $$, useMemo, render, customElement, isObservable, createContext, useContext, useEffect, defaults, SYMBOL_DEFAULT, useMountedContext, type ElementAttributes } from 'woby'
import type { ObservableReadonly } from 'soby'

// Create a context for sharing values between parent and child elements
const CounterContext = createContext(null)
const useCounterContext = () => useContext(CounterContext)

// Define default props using the def function pattern
const def = () => {
    const value = $(0, { type: 'number' } as const)
    return {
        title: $('Counter'),
        // Store function in observable array to hide it from HTML attributes
        increment: $([() => { value($$(value) + 10) }], { toHtml: o => undefined }), //hide this from html attributes
        value,
        nested: { nested: { text: $('abc') } },
        // Object with custom serialization
        obj: $({ nested: { text: 'abc' } }, { toHtml: o => JSON.stringify(o), fromHtml: o => JSON.parse(o) }),
        // Date with custom serialization
        date: $(new Date(), { toHtml: o => o.toISOString(), fromHtml: o => new Date(o) }),
        disabled: $(false, { type: 'boolean' } as const),
        children: undefined
    }
}

// Create the component using defaults for proper two-way synchronization
const Counter = defaults(def, (props) => {
    const {
        title,
        increment: inc,
        // decrement,
        value,
        nested,
        disabled,
        obj,
        date,
        children,
        ...restProps
    } = props

    // Use mounted context for proper context propagation in custom elements
    const context = useMountedContext(CounterContext)

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
            <p>Parent Context (TSX): <b>{context}</b></p>
            <p>Object: {() => JSON.stringify($$(obj))}</p>
            <p>Date: {() => $$(date).toString()}</p>
            <button disabled={disabled} onClick={increment}>+</button>
            <button disabled={disabled} onClick={decrement}>-</button>

            {() => $$(children) ?
                <div style={{ border: '1px solid gray', padding: '10px' }}>
                    <CounterContext.Provider value={value}>
                        {children}
                    </CounterContext.Provider>
                </div>
                : null}
            <p>------------{title} compoent end-------------</p>
        </div>
    )
})
```

### Context Value Component

```typescript
// Simple context value display component
const ContextValue = defaults(() => ({}), (props) => {
    const context = useMountedContext(CounterContext) //direct use
    return <span >(Context Value = <b>{context}</b>)</span>
})

// Processed context value component
const ProcessedContextValue = defaults(() => ({}), (props) => {
    const [context, m] = useMountedContext(CounterContext)
    return <span >(Pcocessed Context Value = <b>{useMemo(() => $$($$(context)) + ' Processed')}</b>){m}</span>
})
```

### Custom Element Registration

```typescript
// Register components as custom elements
customElement('counter-element', Counter)
customElement('context-value', ContextValue)
customElement('my-上下문-값', ContextValue)
customElement('processed-context-value', ProcessedContextValue)
```

### JSX Namespace Extension

```typescript
// Extend JSX namespace to include custom elements for TypeScript support
declare module 'woby' {
    namespace JSX {
        interface IntrinsicElements {
            'counter-element': ElementAttributes<typeof Counter>
            'context-value': ElementAttributes<typeof ContextValue>
            'my-上下문-값': ElementAttributes<typeof ContextValue>
            'processed-context-value': ElementAttributes<typeof ProcessedContextValue>
        }
    }
}
```

## HTML Usage

Custom elements can be used directly in HTML with automatic attribute synchronization:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Counter</title>
</head>
<body>
    <div id="app"></div>
    <script type="module" src="./index.tsx"></script>

    <h1>HTML-created Custom Elements with Context</h1>

    <!-- Parent counter element with a value -->
    <counter-element title="Parent Counter" value="5" style.color="blue" style.font-size="1.5em"
        class="border-2 border-blue-500 border-solid bg-amber-400 p-4 m-2">
        <p>Parent Counter Content</p>
        <p>Parent Context Value: <context-value /></p>
        <p>Parent my-上下문-값: <my-上下문-값 /></p>
        Child counter element that should inherit context
        <counter-element title="Child Counter" value="10" style$color="green" style$font-size="1em"
            obj='{"name": "John", "age": 30}' class="border-2 border-green-500 border-solid bg-yellow-200 p-2 m-2">
            <p>Child Context Value: <context-value /></p>
            <p>Child my-上下문-값: <my-上下문-값 /></p>
        </counter-element>
    </counter-element>
</body>
</html>
```

## JSX/TSX Usage

Custom elements can also be used in JSX/TSX with full TypeScript support:

```typescript
const App = () => {
    const value = $(0)
    const increment = () => value(prev => prev + 1)
    const decrement = () => value(prev => prev - 1)

    return <>
        <h1>Custom element<br /></h1>
        <h1>&lt;counter-element&gt; - &lt;counter-element&gt;:<br /></h1>
        <counter-element title={'Custom element in TSX'}
            style$color={'red'}
            style$font-size='1.1em'
            nested$nested$text='xyz'
            nested={{ nested: { text: $('abc') } }}
            obj={$({ nested: { text: 'this obj will be serialized and deserialized to html attribute' } }, { toHtml: obj => JSON.stringify(obj), fromHtml: obj => JSON.parse(obj) })}
            class={'border-2 border-black border-solid bg-amber-400'}>
            <context-value />
            <ContextValue />
            <ProcessedContextValue />
            <processed-context-value />

            <h2>Nested Custom &lt;counter-element&gt;:<br /></h2>
            <counter-element title={'counter-element Nested'}
                style$color={'orange'}
                style$font-size='1em'
                nested$nested$text=' nested context'
                nested={{ nested: { text: $(' nested context') } }}
                class={'border-2 border-black border-solid bg-amber-400 m-10'}>
                <context-value />
                <ContextValue />
            </counter-element>
        </counter-element>
    </>
}
```

## Key Concepts Explained

### 1. Defaults Pattern

The `defaults` function is essential for custom elements because it:
- Enables two-way synchronization between HTML attributes and component props
- Provides default values for all props
- Handles proper merging of props from different sources

```typescript
const Counter = defaults(def, (props) => {
    // Component implementation
})
```

### 2. Function Storage in Observables

Functions cannot be directly stored in observables for HTML usage. Instead, they are stored in arrays:

```typescript
increment: $([() => { value($$(value) + 10) }], { toHtml: o => undefined })
```

The `toHtml: o => undefined` option prevents the function from appearing as an HTML attribute.

### 3. Object and Date Serialization

Complex objects and dates require custom serialization:

```typescript
// Object serialization
obj: $({ nested: { text: 'abc' } }, { 
    toHtml: o => JSON.stringify(o), 
    fromHtml: o => JSON.parse(o) 
})

// Date serialization
date: $(new Date(), { 
    toHtml: o => o.toISOString(), 
    fromHtml: o => new Date(o) 
})
```

### 4. Context Propagation

Custom elements automatically propagate context to child elements:

```typescript
const context = useMountedContext(CounterContext)
```

### 5. Nested Properties

Nested properties can be accessed using dot notation in HTML and dash notation in JSX:

```html
<!-- HTML usage -->
<counter-element nested.nested.text="value"></counter-element>
```

```tsx
// JSX usage
<counter-element nested-nested-text="value"></counter-element>
```

### 6. Style Properties

Style properties can be set using dot notation in HTML and dash notation in JSX:

```html
<!-- HTML usage -->
<counter-element style.color="red" style.font-size="1.5em"></counter-element>
```

```tsx
// JSX usage
<counter-element style$color="red" style$font-size="1.5em"></counter-element>
```

## Best Practices

1. **Always use `defaults`** for custom elements to enable proper synchronization
2. **Store functions in arrays** with `toHtml: o => undefined` to hide them from HTML
3. **Use `useMountedContext`** for context in custom elements
4. **Provide custom serialization** for complex objects and dates
5. **Extend JSX namespace** for TypeScript support
6. **Use proper type annotations** for all props

## Common Patterns

### Simple Counter Component

```typescript
function def() {
    const value = $(0, { type: 'number' } as const)
    return {
        value,
        increment: $([() => { value($$(value) + 1) }], { toHtml: o => undefined })
    }
}

const SimpleCounter = defaults(def, (props) => {
    const { value, increment } = props
    return (
        <div>
            <span>{value}</span>
            <button onClick={() => increment[0]()}>+</button>
        </div>
    )
})

customElement('simple-counter', SimpleCounter)
```

### Component with Context

```typescript
const MyContext = createContext(null)

const ContextDisplay = defaults(() => ({}), (props) => {
    const context = useMountedContext(MyContext)
    return <span>Context Value: {context}</span>
})

customElement('context-display', ContextDisplay)
```

This comprehensive guide demonstrates how to create powerful, flexible custom elements in Woby that work seamlessly in both HTML and JSX contexts.