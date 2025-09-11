# Counter Demo

**Repository**: [woby-demo](https://github.com/wongchichong/demo)  
**Location**: `demo/counter/`  
**Run**: `pnpm dev:counter`  
**Live Demo**: [CodeSandbox](https://codesandbox.io/s/demo-counter-23fv5)

## Overview

The Counter demo is the foundational example that demonstrates core Woby concepts. It's the perfect starting point for learning the framework, showcasing reactive state, event handling, component composition, and custom elements in a simple, easy-to-understand application.

## Key Concepts Demonstrated

- ✅ **Reactive Observables** - Basic state management with `$()`
- ✅ **Event Handling** - Button click interactions  
- ✅ **Custom Elements** - Web component registration
- ✅ **Component Composition** - Reusable component patterns
- ✅ **Computed Values** - Derived state with `useMemo`
- ✅ **State Updates** - Function-based state updates
- ✅ **Props Interface** - Component prop patterns
- ✅ **TypeScript Integration** - Full type safety

## Complete Source Code

```typescript
/* IMPORT */
import { 
  $, 
  $$, 
  useMemo, 
  render, 
  Observable, 
  customElement, 
  ElementAttributes 
} from 'woby'

/* MAIN */

const Counter = ({ 
  increment, 
  decrement, 
  value, 
  ...props 
}: { 
  increment: () => number
  decrement: () => number
  value: Observable<number> 
}): JSX.Element => {
  // Local component state
  const v = $('abc')
  
  // Computed value with automatic dependency tracking
  const m = useMemo(() => {
    console.log($$(value) + $$(v))
    return $$(value) + $$(v)
  })
  
  return <div {...props}>
    <h1>Counter</h1>
    <p>{value}</p>        {/* Observable displayed directly */}
    <p>{m}</p>            {/* Computed value displayed */}
    <button onClick={increment}>+</button>
    <button onClick={decrement}>-</button>
  </div>
}

// Register component as custom web element
customElement('counter-element', ['value', 'class'], Counter)

// TypeScript declaration for custom element
declare module 'woby' {
  namespace JSX {
    interface IntrinsicElements {
      'counter-element': ElementAttributes<typeof Counter>
    }
  }
}

const App = () => {
  // Application state
  const value = $(0)
  
  // State update functions
  const increment = () => value(prev => prev + 1)
  const decrement = () => value(prev => prev - 1)

  // Render both custom element and regular component
  return [
    <counter-element 
      {...{ value, increment, decrement }} 
      class="border-2 border-black border-solid bg-amber-400"
    />,
    <Counter {...{ value, increment, decrement }} />
  ]
}

render(<App />, document.getElementById('app'))
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
const Counter = ({ 
  increment, 
  decrement, 
  value, 
  ...props 
}: { 
  increment: () => number
  decrement: () => number
  value: Observable<number> 
}) => {
```

**Key Points:**
- Props can include observables directly
- Functions passed as event handlers
- `...props` spreads additional properties
- TypeScript provides compile-time safety

### 4. Computed Values with useMemo

```typescript
const v = $('abc')
const m = useMemo(() => {
  return $$(value) + $$(v)  // $$ unwraps observable values
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

### 5. Custom Element Registration

```typescript
customElement('counter-element', ['value', 'class'], Counter)
```

**Key Points:**
- Registers component as standard web component
- `['value', 'class']` specifies watched attributes
- Works with standard DOM APIs
- Enables usage in any web framework

**Usage:**
```html
<!-- Can be used in regular HTML -->
<counter-element value="5" class="my-style"></counter-element>
```

### 6. TypeScript Integration

```typescript
declare module 'woby' {
  namespace JSX {
    interface IntrinsicElements {
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

### 7. Component Composition

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

### Step 5: Custom Elements
Register as web component:

```typescript
customElement('my-counter', ['value'], Counter)

// Use anywhere
<my-counter value={count} />
```

## Performance Characteristics

### Fine-Grained Updates
Woby's reactivity system updates only what changed:

```typescript
// When count changes from 5 to 6:
// ❌ React: Entire Counter component re-renders
// ✅ Woby: Only the text node "5" → "6" updates
```

### Automatic Batching
Multiple updates in the same frame are automatically batched:

```typescript
// These three updates result in only one DOM update
increment()
increment() 
increment()
```

### Memory Efficiency
Observables clean up automatically when components unmount:

```typescript
// No manual cleanup needed - Woby handles it
const Counter = () => {
  const localState = $(0)  // Automatically cleaned up
  return <div>{localState}</div>
}
```

## Common Patterns

### Multiple State Values
```typescript
const App = () => {
  const count = $(0)
  const step = $(1)
  const name = $('Counter')
  
  const increment = () => count(prev => prev + step())
  
  return (
    <div>
      <h1>{name}</h1>
      <p>Count: {count}</p>
      <p>Step: <input value={step} onInput={e => step(+e.target.value)} /></p>
      <button onClick={increment}>+{step}</button>
    </div>
  )
}
```

### Conditional Rendering
```typescript
const Counter = ({ value }) => (
  <div>
    <p>Count: {value}</p>
    {value() > 10 && <p>Getting high!</p>}
    {value() === 0 ? <p>Zero</p> : <p>Non-zero</p>}
  </div>
)
```

### State Persistence
```typescript
const Counter = () => {
  const count = $(parseInt(localStorage.getItem('count') || '0'))
  
  // Save to localStorage when count changes
  useEffect(() => {
    localStorage.setItem('count', count().toString())
  })
  
  return <div>Count: {count}</div>
}
```

### Reset Functionality
```typescript
const Counter = () => {
  const initialValue = 0
  const count = $(initialValue)
  
  const increment = () => count(prev => prev + 1)
  const decrement = () => count(prev => prev - 1)
  const reset = () => count(initialValue)
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={reset}>Reset</button>
    </div>
  )
}
```

## Variations and Extensions

### Multi-Counter Application
```typescript
const MultiCounter = () => {
  const counters = $([
    { id: 1, value: $(0) },
    { id: 2, value: $(0) },
    { id: 3, value: $(0) }
  ])
  
  const total = useMemo(() => 
    counters().reduce((sum, counter) => sum + counter.value(), 0)
  )
  
  return (
    <div>
      <h1>Total: {total}</h1>
      <For values={counters}>
        {counter => (
          <Counter 
            key={counter.id}
            value={counter.value}
            onIncrement={() => counter.value(v => v + 1)}
          />
        )}
      </For>
    </div>
  )
}
```

### Counter with History
```typescript
const CounterWithHistory = () => {
  const count = $(0)
  const history = $<number[]>([])
  
  const updateCount = (newValue: number) => {
    history(prev => [...prev, count()])
    count(newValue)
  }
  
  const increment = () => updateCount(count() + 1)
  const undo = () => {
    const hist = history()
    if (hist.length > 0) {
      count(hist[hist.length - 1])
      history(prev => prev.slice(0, -1))
    }
  }
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+</button>
      <button onClick={undo} disabled={() => history().length === 0}>
        Undo
      </button>
    </div>
  )
}
```

## Next Steps

After mastering the Counter demo:

1. **[Clock Demo](./Clock-Demo.md)** - Learn time-based updates and animations
2. **[Store Counter Demo](./Store-Counter-Demo.md)** - Explore complex state management
3. **[Playground Demo](./Playground-Demo.md)** - Interactive exploration of all features
4. **[Performance Demos](../Demo-Applications.md#performance-demos)** - Understand optimization

## Related Documentation

- [Reactivity System](../Reactivity-System.md) - Deep dive into observables
- [Core Methods](../Core-Methods.md) - Complete API reference
- [Hooks](../Hooks.md) - Built-in utilities like `useMemo`
- [Demo Applications](../Demo-Applications.md) - All available demos

The Counter demo provides the essential foundation for understanding Woby. Master these concepts and patterns, and you'll be ready to build more complex reactive applications.