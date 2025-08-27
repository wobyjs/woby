# Built-in Components

Woby provides several built-in components that handle common UI patterns efficiently. These components are optimized for Woby's reactive system and provide fine-grained updates.

## Table of Contents

- [Control Flow](#control-flow)
- [Lists and Iteration](#lists-and-iteration)
- [Conditional Rendering](#conditional-rendering)
- [Async Components](#async-components)
- [Utility Components](#utility-components)

## Control Flow

### If

Conditionally renders content based on a boolean condition.

**Signature:**
```typescript
interface IfProps {
  when: ObservableMaybe<unknown>
  fallback?: JSX.Element
  children: JSX.Element
}
```

**Usage:**
```typescript
import { $, If } from 'woby'

const Component = () => {
  const isLoggedIn = $(false)
  
  return (
    <div>
      <If when={isLoggedIn} fallback={<div>Please log in</div>}>
        <div>Welcome back!</div>
      </If>
      
      <button onClick={() => isLoggedIn(!isLoggedIn())}>
        Toggle Login
      </button>
    </div>
  )
}
```

### Switch

Renders different content based on multiple conditions (like switch/case).

**Signature:**
```typescript
interface SwitchProps {
  fallback?: JSX.Element
  children: JSX.Element[]
}

interface MatchProps {
  when: ObservableMaybe<unknown>
  children: JSX.Element
}
```

**Usage:**
```typescript
import { $, Switch, Match } from 'woby'

const Component = () => {
  const status = $<'loading' | 'success' | 'error'>('loading')
  
  return (
    <div>
      <Switch fallback={<div>Unknown status</div>}>
        <Match when={() => status() === 'loading'}>
          <div>Loading...</div>
        </Match>
        <Match when={() => status() === 'success'}>
          <div>Success!</div>
        </Match>
        <Match when={() => status() === 'error'}>
          <div>Error occurred</div>
        </Match>
      </Switch>
      
      <button onClick={() => status('success')}>Set Success</button>
      <button onClick={() => status('error')}>Set Error</button>
    </div>
  )
}
```

### Ternary

A more concise conditional rendering component.

**Signature:**
```typescript
interface TernaryProps {
  when: ObservableMaybe<unknown>
  children: [JSX.Element, JSX.Element] // [truthy, falsy]
}
```

**Usage:**
```typescript
import { $, Ternary } from 'woby'

const Component = () => {
  const isVisible = $(true)
  
  return (
    <div>
      <Ternary when={isVisible}>
        <div>I'm visible!</div>
        <div>I'm hidden!</div>
      </Ternary>
      
      <button onClick={() => isVisible(!isVisible())}>
        Toggle
      </button>
    </div>
  )
}
```

## Lists and Iteration

### For

Efficiently renders lists with fine-grained updates.

**Signature:**
```typescript
interface ForProps<T> {
  values: ObservableMaybe<readonly T[]>
  fallback?: JSX.Element
  children: (item: T, index: Observable<number>) => JSX.Element
}
```

**Usage:**
```typescript
import { $, For } from 'woby'

const TodoList = () => {
  const todos = $([
    { id: 1, text: 'Learn Woby', done: false },
    { id: 2, text: 'Build an app', done: false }
  ])
  
  return (
    <ul>
      <For values={todos} fallback={<li>No todos</li>}>
        {(todo, index) => (
          <li>
            {index() + 1}. {todo.text}
            <input
              type="checkbox"
              checked={todo.done}
              onChange={(e) => {
                todo.done = e.target.checked
                todos([...todos()]) // Trigger update
              }}
            />
          </li>
        )}
      </For>
    </ul>
  )
}
```

### ForValue

Similar to For, but optimized for primitive values.

**Signature:**
```typescript
interface ForValueProps<T> {
  values: ObservableMaybe<readonly T[]>
  fallback?: JSX.Element
  children: (value: T, index: Observable<number>) => JSX.Element
}
```

**Usage:**
```typescript
import { $, ForValue } from 'woby'

const NumberList = () => {
  const numbers = $([1, 2, 3, 4, 5])
  
  return (
    <div>
      <ForValue values={numbers}>
        {(number, index) => (
          <span style={{ margin: '0 5px' }}>
            {number} (#{index() + 1})
          </span>
        )}
      </ForValue>
    </div>
  )
}
```

### ForIndex

Renders based on array indices, useful for fixed-size lists.

**Signature:**
```typescript
interface ForIndexProps<T> {
  values: ObservableMaybe<readonly T[]>
  fallback?: JSX.Element
  children: (value: () => T, index: number) => JSX.Element
}
```

**Usage:**
```typescript
import { $, ForIndex } from 'woby'

const Grid = () => {
  const grid = $(Array(9).fill(0).map((_, i) => i + 1))
  
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
      <ForIndex values={grid}>
        {(value, index) => (
          <div 
            style={{ 
              border: '1px solid #ccc',
              padding: '10px',
              textAlign: 'center'
            }}
            onClick={() => {
              const newGrid = [...grid()]
              newGrid[index] = newGrid[index] * 2
              grid(newGrid)
            }}
          >
            Cell {index}: {value()}
          </div>
        )}
      </ForIndex>
    </div>
  )
}
```

## Conditional Rendering

### Dynamic

Dynamically renders different components based on a value.

**Signature:**
```typescript
interface DynamicProps {
  component: ObservableMaybe<Component | string>
  [key: string]: unknown // Props to pass to the dynamic component
}
```

**Usage:**
```typescript
import { $, Dynamic } from 'woby'

const Button = ({ children, ...props }) => (
  <button {...props}>{children}</button>
)

const Link = ({ children, href, ...props }) => (
  <a href={href} {...props}>{children}</a>
)

const Component = () => {
  const componentType = $<'button' | 'link'>('button')
  const componentMap = {
    button: Button,
    link: Link
  }
  
  return (
    <div>
      <Dynamic
        component={() => componentMap[componentType()]}
        onClick={() => console.log('Clicked!')}
        href="https://example.com"
      >
        Dynamic Content
      </Dynamic>
      
      <button onClick={() => componentType('link')}>
        Switch to Link
      </button>
      <button onClick={() => componentType('button')}>
        Switch to Button
      </button>
    </div>
  )
}
```

## Async Components

### Suspense

Handles loading states for async components.

**Signature:**
```typescript
interface SuspenseProps {
  fallback: JSX.Element
  children: JSX.Element
}
```

**Usage:**
```typescript
import { lazy, Suspense } from 'woby'

const HeavyComponent = lazy(() => import('./HeavyComponent'))

const App = () => (
  <div>
    <h1>My App</h1>
    <Suspense fallback={<div>Loading heavy component...</div>}>
      <HeavyComponent />
    </Suspense>
  </div>
)
```

### ErrorBoundary

Catches and handles errors in component trees.

**Signature:**
```typescript
interface ErrorBoundaryProps {
  fallback: (error: Error, reset: () => void) => JSX.Element
  onError?: (error: Error) => void
  children: JSX.Element
}
```

**Usage:**
```typescript
import { ErrorBoundary } from 'woby'

const BuggyComponent = () => {
  throw new Error('Something went wrong!')
}

const App = () => (
  <div>
    <h1>My App</h1>
    <ErrorBoundary
      fallback={(error, reset) => (
        <div>
          <h2>Something went wrong:</h2>
          <p>{error.message}</p>
          <button onClick={reset}>Try again</button>
        </div>
      )}
      onError={(error) => console.error('Caught error:', error)}
    >
      <BuggyComponent />
    </ErrorBoundary>
  </div>
)
```

## Utility Components

### Portal

Renders content into a different part of the DOM tree.

**Signature:**
```typescript
interface PortalProps {
  mount?: Element
  children: JSX.Element
}
```

**Usage:**
```typescript
import { $, Portal } from 'woby'

const Modal = ({ isOpen, onClose, children }) => (
  <If when={isOpen}>
    <Portal mount={document.body}>
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onClick={onClose}
      >
        <div 
          style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </Portal>
  </If>
)

const App = () => {
  const modalOpen = $(false)
  
  return (
    <div>
      <button onClick={() => modalOpen(true)}>
        Open Modal
      </button>
      
      <Modal 
        isOpen={modalOpen} 
        onClose={() => modalOpen(false)}
      >
        <h2>Modal Content</h2>
        <p>This is rendered in a portal!</p>
      </Modal>
    </div>
  )
}
```

### Fragment

Groups multiple elements without adding extra DOM nodes.

**Signature:**
```typescript
interface FragmentProps {
  children: JSX.Element[]
}
```

**Usage:**
```typescript
import { Fragment } from 'woby'

const Component = () => (
  <div>
    <Fragment>
      <h1>Title</h1>
      <p>Description</p>
      <button>Action</button>
    </Fragment>
  </div>
)

// Or use the short syntax
const ComponentShort = () => (
  <div>
    <>
      <h1>Title</h1>
      <p>Description</p>
      <button>Action</button>
    </>
  </div>
)
```

## Performance Optimization

### Key Considerations

1. **For vs ForValue vs ForIndex**: Choose the right iteration component based on your data type and update patterns.

2. **Conditional Rendering**: Use `If` for simple conditions, `Switch` for multiple conditions, and `Ternary` for inline conditions.

3. **Dynamic Components**: Use `Dynamic` when you need to switch between different component types dynamically.

4. **Error Handling**: Wrap potentially failing components with `ErrorBoundary` to prevent app crashes.

5. **Async Loading**: Use `Suspense` with `lazy` for code splitting and better loading experiences.

### Best Practices

```typescript
// Good: Using the right component for the job
<For values={complexObjects}>
  {(item) => <ComplexItem data={item} />}
</For>

<ForValue values={simpleValues}>
  {(value) => <span>{value}</span>}
</ForValue>

// Good: Proper fallback handling
<If when={user} fallback={<LoginForm />}>
  <UserDashboard user={user} />
</If>

// Good: Error boundaries around risky components
<ErrorBoundary fallback={(error, reset) => <ErrorUI error={error} onRetry={reset} />}>
  <DataFetchingComponent />
</ErrorBoundary>
```

For more patterns and optimization techniques, see our [Performance Guide](./Performance.md).