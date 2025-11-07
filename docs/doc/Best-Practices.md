# Best Practices

This comprehensive guide outlines recommended patterns and methodologies for developing efficient, maintainable Woby applications that leverage the framework's reactive capabilities to their fullest extent.

## Table of Contents

- [Observable Handling](#observable-handling)
- [Ref Management](#ref-management)
- [Component Patterns](#component-patterns)
- [Performance Optimization](#performance-optimization)
- [Dependency Management](#dependency-management)
- [Effect Management](#effect-management)
- [Component Behavior Differences from React](#component-behavior-differences-from-react)

## Observable Handling

### Use `$$()` for Unwrapping Observables

When accessing the value of an observable, it is recommended to utilize `$$()` rather than direct invocation `()` for enhanced type safety and clarity:

```typescript
import { $, $$ } from 'woby'

// ❌ Not recommended - Direct invocation
const count = $(0)
console.log(count()) // Functional but not optimal

// ✅ Recommended - Using $$ for unwrapping
const count = $(0)
console.log($$(count)) // Preferred approach

// ❌ Risky - Direct invocation with uncertain types
const maybeObservable = getValue() // Could be observable or plain value
const value = maybeObservable() // If it's not observable, this will cause an error

// ✅ Safe - Using $$ handles both cases
const maybeObservable = getValue()
const value = $$(maybeObservable) // Works for both observables and plain values
```

**Key Benefits:**
- `$$()` safely handles both observable and non-observable values
- `$$()` provides explicit intent to unwrap a value
- Prevents runtime errors when dealing with uncertain types

### Avoid Setting Observables to Undefined

When interacting with observables, explicitly set values to ensure predictable behavior and prevent unintended state transitions:

```typescript
import { $, $$ } from 'woby'

const count = $(0)

// ❌ Not recommended - This sets count to undefined in convention thinking
count() // Equivalent to count(undefined)

// ✅ Recommended - Only set values explicitly
count(5) // Set to 5
console.log($$(count)) // Read the value
```

## Ref Management

### Using Observables for Refs

Instead of traditional ref patterns, leverage observables to manage DOM references with a more consistent and reactive approach:

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

**Advantages:**
- More consistent with Woby's observable-based approach
- Enables reactive access to DOM elements
- Eliminates the need for special ref handling APIs

## Component Patterns

### Simplified Event Handlers

In Woby, event handlers benefit from automatic optimization through the dependency tracking system, reducing the need for manual memoization techniques:

```typescript
import { useMemo } from 'woby'

// ❌ Over-engineered - Attempting to replicate React patterns
const handleClick = useMemo(() => {
  return (e) => {
    console.log('Button clicked')
  }
})

// ✅ Clean and efficient - Woby's automatic tracking handles optimization
const handleClick = (e) => {
  console.log('Button clicked')
}

const Component = () => {
  return <button onClick={handleClick}>Click me</button>
}
```

## Performance Optimization

### Leverage Automatic Dependency Tracking

Woby's automatic dependency tracking eliminates the need for manual dependency arrays, providing a more intuitive approach to reactive programming:

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
    return computeExpensiveValue($$(a), $$(b))
  })
  
  // This will automatically recompute when a or b changes
  return <div>{expensiveValue}</div>
}
```

### Efficient List Rendering

Woby's fine-grained reactivity enables more efficient list rendering compared to traditional virtual DOM approaches:

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

## Dependency Management

### Automatic Dependency Tracking with `$$()`

One of Woby's key advantages is its automatic dependency tracking system. Instead of manually maintaining dependency arrays like in React, Woby automatically tracks which observables your reactive functions depend on:

```typescript
import { $, $$, useEffect, useMemo } from 'woby'

// ❌ React approach with manual dependency arrays
// useEffect(() => {
//   console.log(userId, theme);
// }, [userId, theme]);

// ✅ Woby approach with automatic tracking
const userId = $(123)
const theme = $('dark')

useEffect(() => {
  console.log($$(userId), $$(theme)) // Automatically tracks userId and theme
})

// The effect will re-run whenever userId or theme changes
```

### Declaring Reactive Variables with `$()`

To make variables reactive and trackable in Woby, you must declare them using `$()`:

```typescript
import { $, $$, useEffect, useMemo } from 'woby'

// ❌ Not reactive - plain variables don't trigger updates
let count = 0;
let name = 'John';

// ✅ Reactive - variables declared with $() are trackable
const count = $(0);
const name = $('John');

// Effects automatically track dependencies when accessed with $$()
useEffect(() => {
  console.log(`Count: ${$$(count)}, Name: ${$$(name)}`);
  // This effect will re-run whenever count or name changes
});

// Memoized computations automatically track dependencies
const doubledCount = useMemo(() => {
  return $$(count) * 2; // Tracks count
});

// Event handlers can access and update current values
const increment = () => {
  count($$(count) + 1); // Increment the observable
};
```

**Key Points:**
- Variables must be declared with `$()` to participate in reactivity
- Access values with `$$()` in reactive contexts for automatic dependency tracking
- Plain JavaScript variables won't trigger reactive updates even if changed

### Migration from React Patterns

When migrating from React, convert dependency arrays to `$$()` calls and ensure state variables are declared with `$()`:

```
// React
const [userId, setUserId] = useState(123);
const [theme, setTheme] = useState('dark');
useEffect(() => {
  fetchData(userId, theme);
}, [userId, theme]);
```

```
// Woby
const userId = $(123);  // Declare with $() for reactivity
const theme = $('dark'); // Declare with $() for reactivity

useEffect(() => {
  fetchData($$(userId), $$(theme)); // Access with $$() for tracking
  // This will automatically re-run when userId or theme changes
});
```

### When to Use `$$()`

Use `$$()` whenever you need to access the value of an observable within a reactive context:

```
import { $, $$, useEffect, useMemo } from 'woby'

const count = $(0)
const multiplier = $(2)

// ✅ In reactive contexts, use $$() for automatic tracking
useEffect(() => {
  console.log(`Count is: ${$$(count)}`)
})

const doubled = useMemo(() => {
  return $$(count) * $$(multiplier)
})

// ✅ In regular functions, you can use direct invocation or $$()
const regularFunction = () => {
  return $$(count) * $$(multiplier) // This works too
  // Or: return $$(count) * $$(multiplier)
}
```

## Effect Management

### Automatic Dependency Tracking in Effects

Woby's [useEffect](file://d:\Developments\tslib\woby\src\hooks\use_effect.ts#L28-L32) automatically tracks which observables are accessed within its callback function, eliminating the need for dependency arrays used in React:

```
import { $, $$, useEffect } from 'woby'

const userId = $(123)
const theme = $('dark')
const count = $(0)

// ✅ Woby approach - automatic dependency tracking
useEffect(() => {
  // This effect automatically tracks userId, theme, and count
  console.log(`User: ${$$(userId)}, Theme: ${$$(theme)}, Count: ${$$(count)}`)
})

// The effect will re-run whenever any of these observables change
userId(456) // Effect re-runs
theme('light') // Effect re-runs
count(1) // Effect re-runs
```

### Organizing Unrelated Reactive Logic

Separate unrelated reactive concerns into individual [useEffect](file://d:\Developments\tslib\woby\src\hooks\use_effect.ts#L28-L32) calls for better performance and clarity:

```
import { $, $$, useEffect } from 'woby'

const name = $('John')
const count = $(0)

// ✅ Recommended - Separate effects for unrelated concerns
useEffect(() => {
  console.log('Name changed:', $$(name))
  // This effect only tracks name
})

useEffect(() => {
  console.log('Count changed:', $$(count))
  // This effect only tracks count
})

// ❌ Not recommended - Single effect with unrelated dependencies
// useEffect(() => {
//   console.log('Name changed:', $$(name))
//   console.log('Count changed:', $$(count))
// })
```

### Using Early Returns for Optimization

Use early returns to skip unnecessary work when observables haven't changed meaningfully:

```
import { $, $$, useEffect } from 'woby'

const name = $('John')
const previousName = $('John')

useEffect(() => {
  // Early return optimization
  if ($$(previousName) === $$(name)) return
  
  // Only perform expensive work when name actually changes
  previousName($$(name)) // Update previous value
  performExpensiveOperation($$(name))
})
```

## Component Behavior Differences from React

### Single Execution vs Re-execution

Unlike React components that re-execute completely on prop or state changes, Woby components execute only once when mounted:

React behavior (for comparison):
```typescript
function ReactComponent({ userName, userId }) {
  console.log("Component re-running") // Logs every time props change
  
  useEffect(() => {
    console.log(userName, userId)
  }, [userName, userId]) // Dependency array required
  
  return <div>{userName}</div>
}
```

Woby behavior:
```typescript
const WobyComponent = ({ userName, userId }) => {
  console.log("Component mounting") // Logs only once
  
  useEffect(() => {
    // Effect re-runs when observables change, not the component
    console.log($$(userName), $$(userId))
  })
  
  return <div>{userName}</div>
}
```

### Reactive Content Patterns

In Woby, there are several correct patterns for creating reactive content:

1. **Direct Observable Passing (Recommended):**
```typescript
const Component = () => {
  const userName = $('John')
  
  // ✅ Direct observable - automatically reactive and preferred
  return <div>{userName}</div>
}
```

2. **Function Expressions:**
```typescript
const Component = () => {
  const userName = $('John')
  const show = $(true)
  
  // ✅ Function expression - automatically reactive
  return <div>Hello {() => $$(userName)}</div>
  
  // ✅ Complex reactive expressions
  return <div class={['w-full', () => $$(show) ? '' : 'hidden']}>Content</div>
}
```

3. **Memoized Expressions:**
```typescript
const Component = () => {
  const userName = $('John')
  
  // ✅ Memoized expression - reactive but unnecessary for simple cases
  return <div>Hello {useMemo(() => $$(userName))}</div>
  
  // Note: useMemo is unnecessary since `() =>` is automatically tracked
}
```

**Common Mistake - Non-Reactive Content:**

```
const Component = () => {
  const userName = $('John')
  
  // ❌ Not reactive - only executes once during component creation
  return <div>Hello {$$(userName)}</div>
}
```

In the non-reactive example above, `$$()` is called during component creation (which only happens once), so the content never updates even when `userName` changes.

### Reactive Attributes

For attributes, you can directly pass observables for automatic reactivity:

```
const Component = () => {
  const valid = $(true)
  const show = $(true)
  
  // ✅ Direct observable - automatically reactive
  return <input disabled={valid} />
  
  // ✅ Function expression - reactive
  return <input disabled={() => $$(valid) ? true : undefined} />
  
  // ✅ Complex reactive class expressions
  return <div class={['w-full', () => $$(show) ? '' : 'hidden']}>Content</div>
}
```

**Key Points:**
- Components execute once, but reactive content updates automatically when observables change
- Direct observable passing (`{userName}`) is the preferred pattern for simple cases
- Function expressions (`{() => $$(userName)}`) are automatically tracked and suitable for complex expressions
- `useMemo` is unnecessary for simple expressions since `() =>` is automatically tracked
- Avoid `{$$()}` patterns as they only execute once and are not reactive

### Fine-Grained Updates

Woby's reactivity system enables fine-grained updates where only specific effects and computations re-run when their dependencies change, rather than re-executing entire components:

```
import { $, $$, useEffect, useMemo } from 'woby'

const WobyComponent = ({ userName, userId }) => {
  const localCount = $(0)
  
  // Component function runs once on mount
  console.log("Mounting component")
  
  // This effect only re-runs when userName changes
  useEffect(() => {
    console.log('User name:', $$(userName))
  })
  
  // This effect only re-runs when localCount changes
  useEffect(() => {
    console.log('Local count:', $$(localCount))
  })
  
  // This computation only re-runs when userId changes
  const userDisplayName = useMemo(() => {
    return `User: ${$$(userId)} - ${$$(userName)}`
  })
  
  return (
    <div>
      <p>{userDisplayName}</p>
      <button onClick={() => localCount($$(localCount) + 1)}>
        Count: {localCount}
      </button>
    </div>
  )
}
```

## Summary

Woby's observable-based reactivity system enables simpler, more intuitive patterns compared to traditional frameworks:

1. Use `$$()` for unwrapping observables safely
2. Manage refs with observables instead of special ref APIs
3. Don't over-optimize event handlers - Woby handles this automatically
4. Leverage automatic dependency tracking instead of manual dependency arrays
5. Use built-in components like `For` for efficient list rendering
6. Separate unrelated reactive logic into individual effects
7. Use early returns to optimize effect execution
8. Understand that components execute once, while effects re-run based on observable changes

These practices will help you write cleaner, more maintainable Woby applications while taking full advantage of the framework's reactivity system.