# Examples

This page contains practical Woby examples demonstrating key framework features and patterns.

## Table of Contents

- [Basic Examples](#basic-examples)
- [Component Patterns](#component-patterns)
- [State Management](#state-management)
- [Advanced Examples](#advanced-examples)

## Basic Examples

### Counter

The classic counter example:

```typescript
import { $, render } from 'woby'

const Counter = () => {
  const count = $(0)
  
  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={() => count(c => c + 1)}>+</button>
      <button onClick={() => count(c => c - 1)}>-</button>
      <button onClick={() => count(0)}>Reset</button>
    </div>
  )
}

render(<Counter />, document.getElementById('app'))
```

**[Live Demo](https://codesandbox.io/s/woby-demo-counter-23fv5)**

### Digital Clock

Real-time clock using `useInterval`:

```typescript
import { $, useInterval } from 'woby'

const Clock = () => {
  const time = $(new Date())
  
  useInterval(() => time(new Date()), 1000)
  
  return (
    <div style={{ fontSize: '2rem', fontFamily: 'monospace' }}>
      {time().toLocaleTimeString()}
    </div>
  )
}
```

**[Live Demo](https://codesandbox.io/s/woby-demo-clock-w1e7yb)**

### Todo List

Complete todo application:

```typescript
import { $, For } from 'woby'

interface Todo {
  id: number
  text: string
  completed: boolean
}

const TodoApp = () => {
  const todos = $<Todo[]>([])
  const input = $('')

  const addTodo = () => {
    const text = input().trim()
    if (text) {
      todos(prev => [...prev, {
        id: Date.now(),
        text,
        completed: false
      }])
      input('')
    }
  }

  const toggleTodo = (id: number) => {
    todos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  return (
    <div>
      <div>
        <input
          value={input}
          onInput={(e) => input(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
        />
        <button onClick={addTodo}>Add</button>
      </div>

      <For values={todos}>
        {(todo) => (
          <div>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            <span style={{ 
              textDecoration: todo.completed ? 'line-through' : 'none' 
            }}>
              {todo.text}
            </span>
          </div>
        )}
      </For>
    </div>
  )
}
```

## Component Patterns

### Modal Component

Reusable modal with portal:

```typescript
import { $, Portal, If } from 'woby'

const Modal = ({ isOpen, onClose, title, children }) => (
  <If when={isOpen}>
    <Portal mount={document.body}>
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onClick={onClose}
      >
        <div 
          style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '8px',
            maxWidth: '500px'
          }}
          onClick={e => e.stopPropagation()}
        >
          <h2>{title}</h2>
          {children}
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </Portal>
  </If>
)
```

### Custom Hooks

Creating reusable logic:

```typescript
import { $, useBoolean } from 'woby'

const useCounter = (initial = 0) => {
  const count = $(initial)
  const increment = () => count(c => c + 1)
  const decrement = () => count(c => c - 1)
  const reset = () => count(initial)
  
  return { count, increment, decrement, reset }
}

const useToggle = (initial = false) => {
  const [state, toggle, enable, disable] = useBoolean(initial)
  return { state, toggle, enable, disable }
}
```

## State Management

### Shopping Cart

Complex state with store:

```typescript
import { store, For, useMemo } from 'woby'

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
}

const cartStore = store({
  items: [] as CartItem[]
})

const useCart = () => {
  const addItem = (product) => {
    const items = cartStore.items()
    const existing = items.find(item => item.id === product.id)
    
    if (existing) {
      existing.quantity += 1
      cartStore.items([...items])
    } else {
      cartStore.items([...items, { ...product, quantity: 1 }])
    }
  }
  
  const total = useMemo(() => {
    return cartStore.items().reduce((sum, item) => 
      sum + (item.price * item.quantity), 0
    )
  })
  
  return { addItem, total }
}

const Cart = () => {
  const { total } = useCart()
  
  return (
    <div>
      <For values={() => cartStore.items()}>
        {item => (
          <div>
            {item.name} - ${item.price} x {item.quantity}
          </div>
        )}
      </For>
      <div>Total: ${total().toFixed(2)}</div>
    </div>
  )
}
```

## Advanced Examples

### Data Fetching

Using resources for async data:

```typescript
import { $, useResource, For, Switch, Match } from 'woby'

const UserPosts = () => {
  const userId = $(1)
  
  const posts = useResource(async () => {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts?userId=${userId()}`
    )
    return response.json()
  })
  
  return (
    <div>
      <input 
        type="number" 
        value={userId}
        onInput={e => userId(parseInt(e.target.value))}
      />
      
      <Switch>
        <Match when={() => posts.loading()}>
          <div>Loading...</div>
        </Match>
        <Match when={() => posts.error()}>
          <div>Error: {() => posts.error()?.message}</div>
        </Match>
        <Match when={() => posts()}>
          <For values={() => posts() || []}>
            {post => (
              <article>
                <h3>{post.title}</h3>
                <p>{post.body}</p>
              </article>
            )}
          </For>
        </Match>
      </Switch>
    </div>
  )
}
```

### Animation

Using animation hooks:

```typescript
import { $, useAnimationLoop } from 'woby'

const AnimatedBox = () => {
  const rotation = $(0)
  const scale = $(1)
  
  useAnimationLoop((time) => {
    rotation(time * 0.001)
    scale(1 + Math.sin(time * 0.002) * 0.2)
  })
  
  return (
    <div style={{
      width: '100px',
      height: '100px',
      backgroundColor: 'blue',
      transform: `rotate(${rotation()}rad) scale(${scale()})`,
      margin: '50px auto'
    }} />
  )
}
```

## Common Patterns

### Working with DOM References

Woby provides a simpler approach to DOM references compared to traditional frameworks:

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

### Event Handler Patterns

In Woby, you often don't need to memoize event handlers:

```typescript
// ❌ React
const handleClick = useCallback(() => {
  return (e) => {
    console.log('Button clicked')
  }
})

// ✅ Simple and clean - Woby's automatic tracking handles optimization
const handleClick = (e) => {
  console.log('Button clicked')
}
```

## Live Demos

- **[Playground](https://codesandbox.io/s/woby-playground-7w2pxg)** - Interactive environment
- **[Counter](https://codesandbox.io/s/woby-demo-counter-23fv5)** - Basic counter
- **[Clock](https://codesandbox.io/s/woby-demo-clock-w1e7yb)** - Real-time clock
- **[Boxes](https://codesandbox.io/s/woby-demo-boxes-wx6rqb)** - Animated boxes
- **[Triangle](https://codesandbox.io/s/woby-demo-triangle-l837v0)** - Performance test

**[View More Examples](https://github.com/wongchichong/woby-demo)**