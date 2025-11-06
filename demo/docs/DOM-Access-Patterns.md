# DOM Access Patterns in Woby

This guide explains the correct patterns for accessing DOM elements directly in Woby applications. Understanding these patterns is crucial for proper framework usage and avoiding common pitfalls.

## Table of Contents

- [Direct DOM Access](#direct-dom-access)
- [Ref Pattern - Correct Usage](#ref-pattern---correct-usage)
- [Ref Pattern - Incorrect Usage](#ref-pattern---incorrect-usage)
- [Why This Pattern?](#why-this-pattern)
- [Working with Ref Values](#working-with-ref-values)

## Direct DOM Access

Woby provides a reactive way to access DOM elements through refs. Unlike traditional frameworks that use callback refs, Woby uses observables for ref management.

## Ref Pattern - Correct Usage

```typescript
import { $, $$, render } from 'woby'

const MyComponent = () => {
  // Create a ref using the $ function with proper typing
  const divRef = $<HTMLDivElement>()

  const handleClick = () => {
    // Access the ref value using the $$ function
    if ($$(divRef)) {
      $$(divRef).style.backgroundColor = 'red'
    }
  }

  return (
    <div>
      {/* Directly pass the observable ref to the element */}
      <div ref={divRef}>Hello World</div>
      <button onClick={handleClick}>Change Color</button>
    </div>
  )
}

render(<MyComponent />, document.getElementById('app'))
```

## Ref Pattern - Incorrect Usage

```typescript
// ❌ INCORRECT - This is NOT the Woby way
const MyComponent = () => {
  // Don't use regular variables for refs
  let divRef: HTMLDivElement | undefined

  const handleClick = () => {
    // This approach doesn't work properly with Woby's reactivity
    if (divRef) {
      divRef.style.backgroundColor = 'red'
    }
  }

  return (
    <div>
      {/* Don't use callback functions for refs */}
      <div ref={el => divRef = el}>Hello World</div>
      <button onClick={handleClick}>Change Color</button>
    </div>
  )
}
```

## Why This Pattern?

### 1. Reactive Integration
Woby's ref pattern integrates seamlessly with its reactive system:

```typescript
const MyComponent = () => {
  const divRef = $<HTMLDivElement>()
  
  // This effect will run when the ref is assigned
  useEffect(() => {
    if ($$(divRef)) {
      console.log('Div is now available:', $$(divRef))
    }
  })
  
  return <div ref={divRef}>Hello World</div>
}
```

### 2. Automatic Cleanup
The observable pattern handles cleanup automatically when components are unmounted.

### 3. Consistent with Woby Patterns
This approach is consistent with how all other reactive values work in Woby:

```typescript
// All follow the same pattern:
const count = $(0)           // Create observable
const handleClick = () => count(count() + 1)  // Update observable
<p>Count: {count}</p>        // Read observable in template

// Refs work the same way:
const divRef = $<HTMLDivElement>()  // Create observable ref
<div ref={divRef}>Hello</div>       // Assign to element
$$($$(divRef).style.backgroundColor = 'red') // Access ref value
```

## Working with Ref Values

### Basic Ref Access
```typescript
const MyComponent = () => {
  const inputRef = $<HTMLInputElement>()
  
  const focusInput = () => {
    if ($$(inputRef)) {
      $$(inputRef).focus()
    }
  }
  
  return (
    <div>
      <input ref={inputRef} type="text" />
      <button onClick={focusInput}>Focus Input</button>
    </div>
  )
}
```

### Ref with Effects
```typescript
const MyComponent = () => {
  const divRef = $<HTMLDivElement>()
  
  // Effect that runs when element is mounted
  useEffect(() => {
    if ($$(divRef)) {
      // Element is now available
      $$(divRef).addEventListener('click', handleClick)
      
      // Cleanup function
      return () => {
        $$(divRef).removeEventListener('click', handleClick)
      }
    }
  })
  
  const handleClick = () => {
    console.log('Div clicked!')
  }
  
  return <div ref={divRef}>Click me!</div>
}
```

### Multiple Refs
```typescript
const MyComponent = () => {
  const firstRef = $<HTMLDivElement>()
  const secondRef = $<HTMLDivElement>()
  
  const handleMoveFocus = () => {
    if ($$(secondRef)) {
      $$(secondRef).focus()
    }
  }
  
  return (
    <div>
      <input ref={firstRef} type="text" />
      <input ref={secondRef} type="text" />
      <button onClick={handleMoveFocus}>Move to Second</button>
    </div>
  )
}
```

## Key Takeaways

1. **Always use `$<ElementType>()`** to create refs, not regular variables
2. **Use `$$()`** to access the current value of a ref
3. **Pass the observable directly** to the ref attribute, not a callback function
4. **Check for null/undefined** before using ref values
5. **This pattern is consistent** with all other reactive values in Woby

## AI/Reader Note

When reading Woby documentation or examples, always look for the `$()` and `$$()` patterns for refs. The callback ref pattern (`ref={el => ref = el}`) is not the Woby way and should be avoided.