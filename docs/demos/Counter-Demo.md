# Counter Demo

**Repository**: [@woby/demo](https://github.com/wobyjs/demo)  
**Location**: `demo/counter/`  
**Run**: `pnpm dev:counter`  
**Live Demo**: [CodeSandbox](https://codesandbox.io/s/demo-counter-23fv5)

## Overview

The Counter demo is the foundational example that demonstrates core Woby concepts. It's the perfect starting point for learning the framework, showcasing reactive state, event handling, component composition, and custom elements in a simple, easy-to-understand application.

This demo also showcases the advanced `defaults` pattern for creating custom elements with two-way synchronization between HTML attributes and component props.

For information about how HTML string attributes are automatically converted to typed component props, see the [Type Synchronization Documentation](../Type-Synchronization.md).

## Key Concepts Demonstrated

- ✅ **Reactive Observables** - Basic state management with `$()`
- ✅ **Event Handling** - Button click interactions  
- ✅ **Custom Elements** - Web component registration
- ✅ **Component Composition** - Reusable component patterns
- ✅ **Computed Values** - Derived state with `useMemo`
- ✅ **State Updates** - Function-based state updates
- ✅ **Props Interface** - Component prop patterns
- ✅ **TypeScript Integration** - Full type safety
- ✅ **Two-Way Attribute Synchronization** - HTML attributes ↔ component props
- ✅ **Default Props Pattern** - Using `defaults` function

## Complete Source Code

```typescript
/**
 * Counter Component Demo
 * 
 * This is a demonstration of creating a custom element with the Woby framework
 * that showcases reactive properties, nested properties, and style attributes.
 * 
 * @file index.tsx
 */

/* IMPORT */
import { $, $$, useMemo, render, customElement, isObservable, createContext, useContext, useEffect, useMounted, defaults } from 'woby'
import type { Observable, ElementAttributes, ObservableMaybe } from 'woby'

const CounterContext = createContext<Observable<number> | null>(null)
const useCounterContext = () => useContext(CounterContext)

/**
 * Counter Component Properties
 * 
 * Defines the interface for the Counter component's properties.
 */
interface CounterProps {
    /** Function to increment the counter value */
    increment?: () => void

    /** Function to decrement the counter value */
    decrement?: () => void

    /** Observable containing the current counter value */
    value?: Observable<number>

    disabled?: Observable<boolean>
    children?: JSX.Element
    /** Optional nested property structure */
    nested?: {
        nested: {
            /** Text value that can be either observable or plain string */
            text: ObservableMaybe<string>
        }
    }
}

// Apply defaults to the Counter component manually
function def() {
    const value = $(0, { type: 'number' } as const)
    return {
        value,
        increment: () => { value($$(value) + 1) },
        decrement: () => { value($$(value) - 1) },
        nested: { nested: { text: $('abc') } },
        disabled: $(false, { type: 'boolean' } as const),
        children: undefined
    }
}

/**
 * Counter Component
 * 
 * A simple counter component that displays a value and provides
 * buttons to increment and decrement the value.
 * 
 * This component demonstrates the best practice for creating custom elements
 * that can be initialized both programmatically (as a function component) and
 * declaratively (as an HTML custom element).
 * 
 * The key pattern demonstrated here is using the `defaults` function to combine
 * props with default values, ensuring the component works correctly in both
 * function component and custom element contexts.
 * 
 * @param props - Component properties
 * @param props.increment - Function to increment the counter
 * @param props.decrement - Function to decrement the counter
 * @param props.value - Observable containing the counter value
 * @param props.nested - Optional nested properties
 * @returns JSX element representing the counter
 * 
 * @example
 * ```tsx
 * // Function component usage
 * const value = $(0)
 * const increment = () => value(prev => prev + 1)
 * const decrement = () => value(prev => prev - 1)
 * 
 * <Counter value={value} increment={increment} decrement={decrement} />
 * 
 * // HTML custom element usage
 * // <counter-element value="5" style-color="red" nested-nested-text="xyz"></counter-element>
 * ```
 */
const Counter = defaults(def, (propss: CounterProps): JSX.Element => {
    // Best practice: The defaults function handles merging props with defaults
    // This ensures the component works correctly whether initialized as a function component
    // or as a custom element from HTML
    
    const {
        increment,
        decrement,
        value,
        nested,
        disabled,
        children,
        ...props 
    } = propss

    const context = useCounterContext()
    
    /**
     * Extract the nested text value
     */
    const v = useMemo(() => $$($$($$($$(nested)?.nested)?.text))

    /**
     * Memoized computed value combining counter value and nested text
     * 
     * This value will automatically update when either the counter value
     * or the nested text changes.
     */
    const m = useMemo(() => {
        console.log($$(value) + '' + $$(v))
        return $$(value) + '' + $$(v)
    })

    useEffect(() => {
        console.log('mounted')
    })

    return <div {...props} style={{ border: '1px solid red' }}>
        <h1>Counter</h1>
        <p>Value: {value}</p>
        <p>Memo: {m}</p>
        <p>Parent Context: {context}</p>
        <button disabled={disabled} onClick={increment}>+</button>
        <button disabled={disabled} onClick={decrement}>-</button>

        {children ?
            <div style={{ border: '1px solid gray', padding: '10px' }}>
                <CounterContext.Provider value={value}>
                    {children}
                </CounterContext.Provider>
            </div>
            : null}
    </div>
})


/**
 * Register the Counter component as a custom element
 * 
 * This makes the Counter component available as an HTML element
 * with the tag name 'counter-element'.
 * 
 * Observed attributes:
 * - 'value': The counter value
 * - 'class': CSS classes
 * - 'style-*': Style properties (e.g., style-color, style-font-size)
 * - 'nested-*': Nested properties (e.g., nested-nested-text)
 */
customElement('counter-element', Counter)

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
             * - Style properties via the style-* pattern
             * - Nested properties via the nested-* pattern
             */
            'counter-element': ElementAttributes<typeof Counter>
        }
    }
}

/**
 * Application Component
 * 
 * Main application component that demonstrates the counter custom element
 * and the standard Counter component.
 * 
 * @returns Array of JSX elements
 */
const App = () => {
    /**
     * Counter value observable
     */
    const value = $(0)

    /**
     * Increment function
     * 
     * Increases the counter value by 1.
     */
    const increment = () => value(prev => prev + 1)

    /**
     * Decrement function
     * 
     * Decreases the counter value by 1.
     */
    const decrement = () => value(prev => prev - 1)

    return [
        /**
         * Custom element usage with various attribute types:
         * - style-color: Sets text color to red
         * - style-font-size: Sets font size to 2em
         * - nested-nested-text: Sets nested text property to 'xyz'
         * - class: Sets CSS classes for styling
         */
        <counter-element
            style-color={'red'}
            style-font-size='2em'
            nested-nested-text='xyz'
            {...{ value, increment, decrement, nested: { nested: { text: $('abc') } } }}
            class={$('border-2 border-black border-solid bg-amber-400')}>

            <counter-element
                style-color={'pink'}
                style-font-size='1em'
                nested-nested-text=' nested context'
                {...{ value, increment, decrement, nested: { nested: { text: $('abc') } } }}
                class={$('border-2 border-black border-solid bg-amber-400')}>
            </counter-element>,
        </counter-element>,

        /**
         * Standard component usage
         */
        <Counter {...{ value, increment, decrement }} />
    ] as unknown as JSX.Element
}

/**
 * Render the application to the DOM
 * 
 * Mounts the App component to the element with ID 'app'.
 */
render(<App />, document.getElementById('app'))

export default Counter
```

## Code Walkthrough

### 1. Observable State Creation

```typescript
const value = $(0)
```

**Key Points:**
- `$(0)` creates a reactive observable with initial value `0`
- Observable acts as both getter and setter
- Automatically tracks dependencies when accessed
- Triggers updates when changed

**Usage Patterns:**
```typescript
// Read current value
console.log(value())  // 0

// Set new value
value(5)              // Sets to 5

// Update with function (recommended for safety)
value(prev => prev + 1)  // Increments by 1
```

### 2. State Update Functions

```typescript
const increment = () => value(prev => prev + 1)
const decrement = () => value(prev => prev - 1)
```

**Key Points:**
- Function updates prevent race conditions
- `prev` parameter provides current value safely
- Updates are automatically batched for performance
- Only changed parts of UI re-render

**Why Function Updates:**
```typescript
// ❌ Potential race condition
value(value() + 1)

// ✅ Safe function update
value(prev => prev + 1)
```

### 3. Component Props Interface

```typescript
interface CounterProps {
    /** Function to increment the counter value */
    increment?: () => void

    /** Function to decrement the counter value */
    decrement?: () => void

    /** Observable containing the current counter value */
    value?: Observable<number>

    disabled?: Observable<boolean>
    children?: JSX.Element
    /** Optional nested property structure */
    nested?: {
        nested: {
            /** Text value that can be either observable or plain string */
            text: ObservableMaybe<string>
        }
    }
}
```

**Key Points:**
- Props can include observables directly
- Functions passed as event handlers
- Support for nested properties and complex structures
- TypeScript provides compile-time safety

### 4. Default Props Pattern

```typescript
// Apply defaults to the Counter component manually
function def() {
    const value = $(0, { type: 'number' } as const)
    return {
        value,
        increment: () => { value($$(value) + 1) },
        decrement: () => { value($$(value) - 1) },
        nested: { nested: { text: $('abc') } },
        disabled: $(false, { type: 'boolean' } as const),
        children: undefined
    }
}
```

**Key Points:**
- Defines default values for all props
- Uses typed observables for proper HTML attribute handling
- Provides sensible defaults for all component functionality
- Enables two-way synchronization between HTML attributes and props

### 5. Two-Way Synchronization with defaults

```typescript
const Counter = defaults(def, (propss: CounterProps): JSX.Element => {
    // Best practice: The defaults function handles merging props with defaults
    // This ensures the component works correctly whether initialized as a function component
    // or as a custom element from HTML
    
    const {
        increment,
        decrement,
        value,
        nested,
        disabled,
        children,
        ...props 
    } = propss
    
    // ... component implementation
})
```

**Key Points:**
- `defaults()` wraps the component and handles merging of props with defaults internally
- Enables two-way synchronization between HTML attributes and component props
- Works seamlessly for both function component and custom element usage

**How It Works:**
1. **HTML Attributes → Component Props**: When used in HTML, attributes are automatically converted to props
2. **Component Props → HTML Attributes**: When props change programmatically, HTML attributes are updated

### 6. Computed Values with useMemo

```typescript
const v = useMemo(() => $$($$($$(nested)?.nested)?.text))

const m = useMemo(() => {
    console.log($$(value) + '' + $$(v))
    return $$(value) + '' + $$(v)
})
```

**Key Points:**
- `useMemo` creates computed/derived state
- Automatically tracks dependencies (no dependency array needed)
- `$$()` unwraps observable values for computation
- Only recomputes when dependencies change

**Automatic Dependency Tracking:**
```typescript
// This computation depends on both `value` and `v`
// Woby automatically knows this - no manual specification needed
const computed = useMemo(() => $$(value) * 2 + $$(v).length)
```

### 7. Custom Element Registration

```typescript
customElement('counter-element', Counter)
```

**Key Points:**
- Registers component as standard web component
- Works with standard DOM APIs
- Enables usage in any web framework
- Automatically handles attribute observation and conversion

**Usage:**
```html
<!-- Can be used in regular HTML with two-way synchronization -->
<counter-element value="5" style-color="red" nested-nested-text="xyz"></counter-element>
```

### 8. Nested Properties Support

```typescript
<counter-element
    style-color={'red'}
    style-font-size='2em'
    nested-nested-text='xyz'
    {...{ value, increment, decrement, nested: { nested: { text: $('abc') } } }}
    class={$('border-2 border-black border-solid bg-amber-400')}>
</counter-element>
```

**Key Points:**
- Supports nested object properties through dash-separated attribute names
- Style properties automatically converted from kebab-case to camelCase
- Complex nested structures supported
- Works with both HTML attributes and JSX props

**Mapping:**
- Attribute `style-color` maps to `props.style.color`
- Attribute `nested-nested-text` maps to `props.nested.nested.text`

### 9. TypeScript Integration

```typescript
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
             * - Style properties via the style-* pattern
             * - Nested properties via the nested-* pattern
             */
            'counter-element': ElementAttributes<typeof Counter>
        }
    }
}
```

**Benefits:**
- Full IntelliSense support for custom elements
- Compile-time prop validation
- Type safety for all component interactions
- Seamless IDE integration

### 10. Component Composition

```typescript
const App = () => {
    const value = $(0)
    const increment = () => value(prev => prev + 1)
    const decrement = () => value(prev => prev - 1)

    return [
        <counter-element {...{ value, increment, decrement }} />,
        <Counter {...{ value, increment, decrement }} />
    ]
}
```

**Key Points:**
- State managed at parent level
- Same state shared between multiple components
- Both custom element and regular component work identically
- Props spreading with `{...props}` syntax

## Two-Way Synchronization Explained

The key innovation in this demo is the two-way synchronization between HTML attributes and component props, enabled by the `defaults` pattern:

### Without Two-Way Synchronization (Old Pattern)
```typescript
// ❌ No synchronization - attributes and props are not linked
const SimpleCounter = ({ value = $(0) }: { value?: Observable<number> }) => (
  <div>Count: {value}</div>
)

customElement('simple-counter', SimpleCounter)

// In HTML: <simple-counter value="5"></simple-counter>
// The value attribute will NOT be synchronized with the component prop
```

### With Two-Way Synchronization (New Pattern)
```typescript
// ✅ Full synchronization - attributes and props are linked
const Counter = defaults(def, (propss: CounterProps): JSX.Element => {
    const { value } = propss
    return <div>Count: {value}</div>
})

customElement('counter-element', Counter)

// In HTML: <counter-element value="5"></counter-element>
// The value attribute IS synchronized with the component prop
```

## Learning Progression

### Step 1: Basic Observable
Start with the simplest reactive state:

```typescript
const count = $(0)

const SimpleCounter = () => (
  <div>
    <p>Count: {count}</p>
    <button onClick={() => count(count() + 1)}>+</button>
  </div>
)
```

### Step 2: Function Updates
Improve safety with function updates:

```typescript
const increment = () => count(prev => prev + 1)

<button onClick={increment}>+</button>
```

### Step 3: Component Props
Extract reusable component:

```typescript
const Counter = ({ value, onIncrement }) => (
  <div>
    <p>Count: {value}</p>
    <button onClick={onIncrement}>+</button>
  </div>
)

const App = () => {
  const count = $(0)
  return <Counter value={count} onIncrement={() => count(c => c + 1)} />
}
```

### Step 4: Computed Values
Add derived state:

```typescript
const Counter = ({ value }) => {
  const doubled = useMemo(() => value() * 2)
  
  return (
    <div>
      <p>Count: {value}</p>
      <p>Doubled: {doubled}</p>
    </div>
  )
}
```

### Step 5: Custom Elements with Defaults
Register as web component with two-way synchronization:

```typescript
const Counter = defaults(def, ({ value }: { value?: Observable<number> }) => (
  <div>
    <p>Count: {value}</p>
  </div>
))

customElement('my-counter', Counter)

// Use anywhere with full synchronization
<my-counter value={count} />  // JSX usage
// <my-counter value="5"></my-counter>  // HTML usage
```