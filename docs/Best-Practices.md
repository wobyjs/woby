# Best Practices

This guide covers recommended patterns and best practices for writing efficient and maintainable Woby applications.

## Table of Contents

- [Observable Handling](#observable-handling)
- [Ref Management](#ref-management)
- [Component Patterns](#component-patterns)
- [Performance Optimization](#performance-optimization)

## Observable Handling

### Use `$$()` for Unwrapping Observables

When accessing the value of an observable, prefer using `$$()` over direct invocation `()`:

```typescript
import { $, $$ } from 'woby'

// ❌ Avoid - Direct invocation
const count = $(0)
console.log(count()) // Works, but not recommended

// ✅ Prefer - Using $$ for unwrapping
const count = $(0)
console.log($$(count)) // Recommended approach

// ❌ Dangerous - Direct invocation can be ambiguous
const maybeObservable = getValue() // Could be observable or plain value
const value = maybeObservable() // If it's not observable, this will cause an error

// ✅ Safe - Using $$ handles both cases
const maybeObservable = getValue()
const value = $$(maybeObservable) // Works for both observables and plain values
```

**Why this matters:**
- `$$()` safely handles both observable and non-observable values
- `$$()` is more explicit about intent to unwrap a value
- Prevents errors when dealing with uncertain types

### Avoid Setting Observables to Undefined

Be careful when calling observables without parameters as this sets them to `undefined`:

```typescript
import { $, $$ } from 'woby'

const count = $(0)

// ❌ Avoid - This sets count to undefined
count() // Might means to count(undefined) for programmer

// ✅ Correct - Only set values explicitly
count(5) // Set to 5
console.log($$(count)) // Read the value
```

## Ref Management

### Using Observables for Refs

Instead of traditional ref patterns, use observables to manage DOM references:

```typescript
import { $, $$ } from 'woby'
import type { Ref } from 'woby'

// ❌ Traditional React-like ref pattern
const inputRef: Ref<HTMLInputElement> = (element) => {
  if (element) {
    element.focus()
  }
}

// ✅ Woby preferred pattern using observables
const inputRef = $<HTMLInputElement>()
const focusInput = () => {
  $$(inputRef)?.focus()
}

const Component = () => {
  return (
    <div>
      <input ref={inputRef} />
      <button onClick={focusInput}>Focus Input</button>
    </div>
  )
}
```

**Benefits:**
- More consistent with Woby's observable-based approach
- Allows reactive access to DOM elements
- Eliminates the need for special ref handling APIs

## Component Patterns

### Simplified Event Handlers

In Woby, you often don't need to memoize event handlers because of automatic dependency tracking:

```typescript
import { useMemo } from 'woby'

// ❌ Over-engineered - Trying to replicate React patterns
const handleClick = useMemo(() => {
  return (e) => {
    console.log('Button clicked')
  }
})

// ✅ Simple and clean - Woby's automatic tracking handles optimization
const handleClick = (e) => {
  console.log('Button clicked')
}

const Component = () => {
  return <button onClick={handleClick}>Click me</button>
}
```

## Performance Optimization

### Leverage Automatic Dependency Tracking

Woby's automatic dependency tracking eliminates the need for manual dependency arrays:

```typescript
import { $, useMemo } from 'woby'

const Component = ({ a, b }) => {
  const count = $(0)
  
  // ❌ React pattern with manual dependencies
  // const expensiveValue = useMemo(() => {
  //   return computeExpensiveValue(a, b)
  // }, [a, b])
  
  // ✅ Woby pattern - automatic dependency tracking
  const expensiveValue = useMemo(() => {
    return computeExpensiveValue(a, b)
  })
  
  // This will automatically recompute when a or b changes
  return <div>{expensiveValue}</div>
}
```

### Efficient List Rendering

Woby's fine-grained reactivity makes list rendering more efficient:

```typescript
import { $, For } from 'woby'

const Component = () => {
  const items = $([
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' }
  ])
  
  return (
    <ul>
      {/* ✅ Woby's For component handles efficient list rendering */}
      <For values={items}>
        {(item) => (
          <li key={item.id}>
            {item.name}
          </li>
        )}
      </For>
    </ul>
  )
}
```

## Summary

Woby's observable-based reactivity system allows for simpler, more intuitive patterns compared to traditional frameworks:

1. Use `$$()` for unwrapping observables safely
2. Manage refs with observables instead of special ref APIs
3. Don't over-optimize event handlers - Woby handles this automatically
4. Leverage automatic dependency tracking instead of manual dependency arrays
5. Use built-in components like `For` for efficient list rendering

These practices will help you write cleaner, more maintainable Woby applications while taking full advantage of the framework's reactivity system.