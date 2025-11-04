# Best Practices

<cite>
**Referenced Files in This Document**   
- [Woby-vs-React.md](file://docs/Woby-vs-React.md)
- [readme.md](file://readme.md)
- [hooks/use_render_effect.ts](file://src/hooks/use_render_effect.ts)
- [hooks/use_attached.ts](file://src/hooks/use_attached.ts)
- [utils/resolvers.via.ts](file://src/utils/resolvers.via.ts)
- [components/for.ts](file://src/components/for.ts)
- [docs/Hooks.md](file://docs/Hooks.md)
- [docs/Custom-Element-Practical-Guide.md](file://docs/demos/Custom-Element-Practical-Guide.md)
</cite>

## Table of Contents
1. [State Management](#state-management)
2. [Effect Handling](#effect-handling)
3. [Component Design](#component-design)
4. [Performance Optimization](#performance-optimization)
5. [Anti-Patterns to Avoid](#anti-patterns-to-avoid)
6. [Code Organization](#code-organization)
7. [Testing Strategies](#testing-strategies)
8. [Error Handling](#error-handling)
9. [Differences from React Patterns](#differences-from-react-patterns)
10. [Real-World Examples](#real-world-examples)

## State Management

Woby's state management is built around observable-based reactivity, which differs significantly from React's state-based approach. The framework uses the `$()` function to create observables that automatically track dependencies.

When declaring reactive variables, use the `$()` function to wrap values:

```typescript
const count = $(0)
const name = $('John')
```

This creates observables that can be updated directly:

```typescript
count(1) // Set to 1
count(prev => prev + 1) // Increment by 1
```

For complex state structures, Woby supports nested property access through HTML attributes using both `$` and `.` notation, a unique feature not available in React or SolidJS:

```html
<!-- Using $ notation -->
<user-card 
  user$name="John Doe"
  user$details$age="30"
  style$font-size="1.2em"
  style$color="blue">
</user-card>

<!-- Using . notation (HTML only) -->
<user-card 
  user.name="John Doe"
  user.details.age="30"
  style.font-size="1.2em"
  style.color="blue">
</user-card>
```

The framework automatically converts kebab-case attributes to camelCase properties and handles type conversion between HTML strings and JavaScript values.

**Section sources**
- [Woby-vs-React.md](file://docs/Woby-vs-React.md#L280-L320)
- [readme.md](file://readme.md#L28-L35)

## Effect Handling

Woby's effect handling system automatically tracks dependencies without requiring dependency arrays, unlike React's useEffect. Dependencies are automatically detected when accessed with `$$()` in reactive contexts.

Use `useEffect` for side effects that should run when dependencies change:

```typescript
import { $, $$, useEffect } from 'woby'

const name = $('John')
const count = $(0)

useEffect(() => {
  console.log('Name:', $$(name))
  console.log('Count:', $$(count))
})
```

The effect will automatically re-run whenever `name` or `count` changes, without needing to specify a dependency array.

For effects that should run on component mount and cleanup on unmount:

```typescript
useEffect(() => {
  console.log('Component mounted')
  
  return () => {
    console.log('Component will unmount')
  }
})
```

Woby also provides `useRenderEffect` for advanced use cases where effects should not be affected by Suspense:

```typescript
import { useRenderEffect } from 'woby'

useRenderEffect(() => {
  // This effect runs synchronously during rendering
  console.log('Render effect')
}, stack)
```

**Section sources**
- [hooks/use_render_effect.ts](file://src/hooks/use_render_effect.ts#L1-L20)
- [docs/Hooks.md](file://docs/Hooks.md#L119-L130)

## Component Design

Woby components follow a functional approach with direct DOM manipulation, eliminating the need for a virtual DOM. Components can be created as simple functions that return JSX elements.

For custom elements, use the `defaults` pattern to enable two-way synchronization between HTML attributes and component props:

```typescript
function def() {
    return {
        value: $(0, { type: 'number' } as const),
        title: $('Counter')
    }
}

const Counter = defaults(def, (props) => {
    const { value, title } = props
    return (
        <div>
            <h1>{title}</h1>
            <p>Count: {value}</p>
            <button onClick={() => value($$(value) + 1)}>+</button>
        </div>
    )
})

customElement('counter-element', Counter)
```

The `defaults` function:
- Takes a `def` function that returns default props with type information
- Handles merging of HTML attributes with default values
- Manages two-way synchronization between props and attributes

For list rendering, use the `For` component instead of native array mapping:

```tsx
<For values={todos}>
  {(todo) => <div>{todo.text}</div>}
</For>
```

This provides better performance and reactivity compared to native mapping.

**Section sources**
- [components/for.ts](file://src/components/for.ts#L8-L12)
- [docs/Custom-Element-Practical-Guide.md](file://docs/demos/Custom-Element-Practical-Guide.md#L0-L100)

## Performance Optimization

Woby provides several performance optimization techniques that differ from React patterns.

### Avoid Unnecessary useMemo

Simple expressions with `() =>` are automatically tracked and often don't need `useMemo`:

```typescript
// ✅ Recommended - Direct observable passing
<div>Hello {userName}</div>

// ❌ Not needed - Over-engineered
<div>Hello {() => $$(userName)}</div>
```

For computed values, `useMemo` automatically tracks dependencies without requiring a dependency array:

```typescript
const doubledCount = useMemo(() => {
  return $$(count) * 2
})
```

### Use Direct Observable Passing

For simple reactive content, pass observables directly rather than using `$$()` in functions:

```typescript
// ✅ Efficient - Direct passing
<div>{userName}</div>

// ❌ Less efficient - Function wrapper
<div>{() => $$(userName)}</div>
```

### Choose the Right List Component

Select the appropriate list component based on your data type:
- `For` for objects
- `ForValue` for primitives
- `ForIndex` for fixed-size lists

### Effect Organization

Separate unrelated concerns into individual effects for better performance:

```typescript
// ✅ Recommended - Separate effects
useEffect(() => {
  console.log('Name changed:', $$(name))
})

useEffect(() => {
  console.log('Count changed:', $$(count))
})

// ❌ Not recommended - Combined effect
// useEffect(() => {
//   console.log('Name:', $$(name))
//   console.log('Count:', $$(count))
// })
```

### Early Returns

Use early returns to skip unnecessary work in effects:

```typescript
useEffect(() => {
  if ($$(previousName) === $$(name)) return
  previousName($$(name))
  performExpensiveOperation($$(name))
})
```

**Section sources**
- [docs/Hooks.md](file://docs/Hooks.md#L119-L180)
- [readme.md](file://readme.md#L428-L440)

## Anti-Patterns to Avoid

### React-Style useState

Avoid React's useState pattern and use Woby's observable pattern instead:

```tsx
// ❌ Anti-pattern: React-style useState
const [count, setCount] = useState(0)

// ✅ Woby pattern
const count = $(0)
```

### React-Style useEffect with Dependency Array

Don't use dependency arrays with useEffect:

```tsx
// ❌ Anti-pattern: React useEffect with dependency array
useEffect(() => {
  console.log(count)
}, [count])

// ✅ Woby pattern
useEffect(() => {
  console.log($$(count))
})
```

### Non-Reactive Content

Avoid using `$$()` directly in JSX without proper reactive context:

```tsx
// ❌ Anti-pattern: Non-reactive content
<div>Hello {$$(userName)}</div>

// ✅ Woby pattern
<div>Hello {userName}</div>
```

### React-Style Array Mapping

Use the `For` component instead of native array mapping:

```tsx
// ❌ Anti-pattern: React-style array mapping
{todos.map(todo => <div>{todo.text}</div>)}

// ✅ Woby pattern
<For values={todos}>{(todo) => <div>{todo.text}</div>}</For>
```

### Manual Dependency Tracking

Don't manually track dependencies - Woby automatically detects them:

```tsx
// ❌ Anti-pattern: Manual tracking
useEffect(() => {
  console.log($$(count))
}, [$$(count)]) // Dependency array not needed

// ✅ Woby pattern
useEffect(() => {
  console.log($$(count))
})
```

**Section sources**
- [Woby-vs-React.md](file://docs/Woby-vs-React.md#L147-L190)
- [readme.md](file://readme.md#L147-L190)

## Code Organization

Organize your Woby code following these best practices:

### Custom Element Structure

For custom elements, follow this structure:

```typescript
// 1. Define default props with type information
function def() {
    return {
        value: $(0, { type: 'number' } as const),
        title: $('Counter'),
        increment: $([() => {}], { toHtml: o => undefined })
    }
}

// 2. Create component with defaults wrapper
const Counter = defaults(def, (props) => {
    const { value, title, increment: inc } = props
    const increment = $$(inc)[0]
    
    return (
        <div>
            <h1>{title}</h1>
            <p>Count: {value}</p>
            <button onClick={increment}>+</button>
        </div>
    )
})

// 3. Register as custom element
customElement('counter-element', Counter)

// 4. Extend JSX namespace for TypeScript support
declare module 'woby' {
    namespace JSX {
        interface IntrinsicElements {
            'counter-element': ElementAttributes<typeof Counter>
        }
    }
}
```

### Function Organization

Group related functions and effects together:

```typescript
const Counter = () => {
    // State
    const count = $(0)
    
    // Derived state
    const doubled = useMemo(() => $$(count) * 2)
    
    // Event handlers
    const increment = () => count($$(count) + 1)
    const decrement = () => count($$(count) - 1)
    
    // Effects
    useEffect(() => {
        console.log('Count:', $$(count))
    })
    
    // Render
    return (
        <div>
            <p>Count: {count}</p>
            <p>Doubled: {doubled}</p>
            <button onClick={increment}>+</button>
            <button onClick={decrement}>-</button>
        </div>
    )
}
```

**Section sources**
- [docs/Custom-Element-Practical-Guide.md](file://docs/demos/Custom-Element-Practical-Guide.md#L0-L617)
- [docs/CUSTOM_ELEMENTS.md](file://docs/CUSTOM_ELEMENTS.md#L0-L239)

## Testing Strategies

Woby provides built-in testing utilities for component testing:

```typescript
import { render } from 'woby/testing'

// Render component for testing
const { container } = render(<Counter />)

// Test rendered output
expect(container.textContent).toContain('Count: 0')
```

For testing custom elements, test both HTML and JSX usage patterns:

```html
<!-- Test in HTML -->
<counter-element value="5" title="Test Counter"></counter-element>
```

```tsx
// Test in JSX
render(<counter-element value={$(5)} title="Test Counter" />)
```

Test both the initial rendering and state changes:

```typescript
// Test initial state
expect(getByText('Count: 0')).toBeInTheDocument()

// Test state change
fireEvent.click(getByText('+'))
expect(getByText('Count: 1')).toBeInTheDocument()
```

**Section sources**
- [methods/README.md](file://src/methods/README.md#L0-L234)
- [readme.md](file://readme.md#L536-L550)

## Error Handling

Woby provides several mechanisms for error handling:

### ErrorBoundary Component

Use the ErrorBoundary component to catch errors in child components:

```tsx
const Fallback = ({ reset, error }: { reset: () => void, error: Error }) => {
  return (
    <>
      <p>Error: {error.message}</p>
      <button onClick={reset}>Recover</button>
    </>
  )
}

const App = () => {
  return (
    <ErrorBoundary fallback={Fallback}>
      <SomeComponentThatThrows />
    </ErrorBoundary>
  )
}
```

### useError Hook

Use the useError hook to handle errors in reactive computations:

```typescript
useError((error) => {
  console.error('Error in computation:', error)
})
```

### Effect Cleanup

Always clean up resources in effect cleanup functions:

```typescript
useEffect(() => {
  const timer = setInterval(() => {
    console.log('Tick')
  }, 1000)
  
  return () => {
    clearInterval(timer)
  }
})
```

**Section sources**
- [readme.md](file://readme.md#L1908-L1988)
- [hooks/use_attached.ts](file://src/hooks/use_attached.ts#L64-L104)

## Differences from React Patterns

Woby differs significantly from React in several key areas:

### Core Philosophy

| Aspect | React | Woby |
|--------|-------|------|
| Reactivity System | State-based with VDOM | Observable-based with direct DOM manipulation |
| Dependency Management | Manual dependency arrays | Automatic dependency tracking |
| Hook Rules | Strict rules (top-level only, no conditionals) | Flexible hooks (can be conditional, nested, etc.) |
| Performance | VDOM diffing and reconciliation | Fine-grained reactivity |
| Build Process | Often requires Babel transforms | Works with plain JavaScript |

### Ref Handling

Woby simplifies ref handling compared to React:

```tsx
// React
const inputRef = useRef(null)
<input ref={inputRef} />

// Woby
const inputRef = $<HTMLInputElement>()
<input ref={inputRef} />
```

Woby refs provide direct access to DOM elements without requiring a `.current` property.

### useMemo and useEffect

Woby eliminates the need for dependency arrays:

```tsx
// React
useMemo(() => computeExpensiveValue(a, b), [a, b])
useEffect(() => { console.log(count) }, [count])

// Woby
useMemo(() => computeExpensiveValue(a, b))
useEffect(() => { console.log($$(count)) })
```

### useCallback

Woby's automatic dependency tracking eliminates the need for useCallback:

```tsx
// React
const handleClick = useCallback(() => { console.log('clicked') }, [])

// Woby
const handleClick = () => { console.log('clicked') }
```

### forwardRef

Woby simplifies ref forwarding without requiring a special function:

```tsx
// React
const FancyButton = forwardRef((props, ref) => <button ref={ref} />)

// Woby
const FancyButton = ({ ref }) => <button ref={ref} />
```

**Section sources**
- [Woby-vs-React.md](file://docs/Woby-vs-React.md#L1-L480)
- [readme.md](file://readme.md#L327-L377)

## Real-World Examples

### Todo Application

A complete todo application demonstrating Woby patterns:

```tsx
const TodoApp = () => {
  const todos = $([{ id: 1, text: 'Learn Woby', completed: false }])
  const input = $('')
  const filter = $('all')

  const addTodo = () => {
    if ($$(input).trim()) {
      todos(prev => [...prev, { id: Date.now(), text: $$(input), completed: false }])
      input('')
    }
  }

  const toggleTodo = (id) => {
    todos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const filteredTodos = useMemo(() => {
    const currentTodos = $$(todos)
    if ($$(filter) === 'active') return currentTodos.filter(t => !t.completed)
    if ($$(filter) === 'completed') return currentTodos.filter(t => t.completed)
    return currentTodos
  })

  return (
    <div class="todo-app">
      <h1>My Todo App</h1>
      
      <div class="flex gap-2">
        <input
          type="text"
          value={input}
          onInput={(e) => input(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
        />
        <button onClick={addTodo}>Add</button>
      </div>

      <div class="flex gap-2">
        {['all', 'active', 'completed'].map((filterName) => (
          <button
            onClick={() => filter(filterName)}
            class={() => $$(filter) === filterName ? 'active' : ''}
          >
            {filterName}
          </button>
        ))}
      </div>

      <ul>
        <For values={filteredTodos}>
          {(todo) => (
            <li class={{ completed: todo.completed }}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
              />
              <span>{todo.text}</span>
            </li>
          )}
        </For>
      </ul>
    </div>
  )
}
```

### Custom Element with Context

A custom element that uses context for theming:

```typescript
const ThemeContext = createContext('light')

const ThemedButton = defaults(() => ({}), (props) => {
  const theme = useMountedContext(ThemeContext)
  return <button class={() => `btn btn-${$$(theme)}`}>{props.children}</button>
})

customElement('themed-button', ThemedButton)
```

These examples demonstrate Woby's observable-based reactivity, automatic dependency tracking, and direct DOM manipulation patterns.

**Section sources**
- [docs/Custom-Element-Practical-Guide.md](file://docs/demos/Custom-Element-Practical-Guide.md#L0-L617)
- [utils/resolvers.via.ts](file://src/utils/resolvers.via.ts#L92-L126)