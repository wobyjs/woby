# Examples

This page contains practical Woby examples demonstrating key framework features and patterns.

## Table of Contents

- [Basic Examples](#basic-examples)
- [Component Patterns](#component-patterns)
- [State Management](#state-management)
- [Advanced Examples](#advanced-examples)
- [Class Management Patterns](#class-management-patterns)

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

**[Live Demo](https://codesandbox.io/s/demo-counter-23fv5)**

### Digital Clock

Real-time clock using `useInterval`:

```typescript
import { $, useInterval } from 'woby'

const Clock = () => {
  const time = $(new Date())
  
  useInterval(() => time(new Date()), 1000)
  
  return (
    <div style={{ fontSize: '2rem', fontFamily: 'monospace' }}>
      {() => time().toLocaleTimeString()}
    </div>
  )
}
```

**[Live Demo](https://codesandbox.io/s/demo-clock-w1e7yb)**

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
          <div class={{ 
            'todo-item': true,
            'completed': todo.completed,
            'recent': () => Date.now() - todo.id < 60000 // Added in last minute
          }}>
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
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        onClick={onClose}
      >
        <div 
          class="bg-white p-6 rounded-lg max-w-md w-full"
          onClick={e => e.stopPropagation()}
        >
          <h2 class="text-xl font-bold mb-4">{title}</h2>
          {children}
          <button 
            class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={onClose}
          >
            Close
          </button>
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
import { store, useMemo } from 'woby'

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
}

const cartStore = store({
  items: [] as CartItem[],
  discount: 0
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
          <div class="flex justify-between items-center p-2 border-b">
            <span>{item.name}</span>
            <span>${item.price} x {item.quantity}</span>
          </div>
        )}
      </For>
      <div class="font-bold text-right mt-2">
        Total: ${total().toFixed(2)}
      </div>
    </div>
  )
}
```

## Advanced Examples

### Data Fetching with useResource

Asynchronous data handling:

```typescript
import { $, useResource } from 'woby'

interface User {
  id: number
  name: string
  email: string
}

const UserProfile = () => {
  const userId = $(1)
  
  const user = useResource<User>(async () => {
    const response = await fetch(`/api/users/${userId()}`)
    if (!response.ok) throw new Error('Failed to fetch user')
    return response.json()
  })
  
  return (
    <div>
      <input 
        type="number" 
        value={userId}
        onInput={e => userId(parseInt(e.target.value))}
        class="border p-2 mr-2"
      />
      
      <Switch>
        <Match when={() => user.loading()}>
          <div class="text-center py-4">Loading...</div>
        </Match>
        <Match when={() => user.error()}>
          <div class="text-red-500 py-4">
            Error: {() => user.error()?.message}
          </div>
        </Match>
        <Match when={() => user()}>
          <div class="bg-gray-100 p-4 rounded">
            <h3 class="text-lg font-bold">{() => user()?.name}</h3>
            <p class="text-gray-600">{() => user()?.email}</p>
          </div>
        </Match>
      </Switch>
    </div>
  )
}
```

### Form Handling with Validation

Comprehensive form management:

```typescript
import { $, $$, useEffect } from 'woby'

const ContactForm = () => {
  const form = {
    name: $(''),
    email: $(''),
    message: $('')
  }
  
  const errors = {
    name: $(''),
    email: $(''),
    message: $('')
  }
  
  const isSubmitting = $(false)
  
  const validate = () => {
    let isValid = true
    
    if (!$$(form.name).trim()) {
      errors.name('Name is required')
      isValid = false
    } else {
      errors.name('')
    }
    
    if (!$$(form.email).trim()) {
      errors.email('Email is required')
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test($$(form.email))) {
      errors.email('Email is invalid')
      isValid = false
    } else {
      errors.email('')
    }
    
    if (!$$(form.message).trim()) {
      errors.message('Message is required')
      isValid = false
    } else {
      errors.message('')
    }
    
    return isValid
  }
  
  const handleSubmit = (e: Event) => {
    e.preventDefault()
    
    if (validate()) {
      isSubmitting(true)
      // Submit form data
      setTimeout(() => {
        isSubmitting(false)
        // Reset form
        form.name('')
        form.email('')
        form.message('')
      }, 1000)
    }
  }
  
  return (
    <form onSubmit={handleSubmit} class="max-w-md mx-auto p-4">
      <div class="mb-4">
        <label class="block text-gray-700 mb-2">Name:</label>
        <input 
          value={form.name}
          onInput={(e) => form.name(e.target.value)}
          class={[
            'w-full px-3 py-2 border rounded',
            { 'border-red-500': () => !!errors.name() }
          ]}
        />
        {errors.name() && <span class="text-red-500 text-sm">{errors.name()}</span>}
      </div>
      
      <div class="mb-4">
        <label class="block text-gray-700 mb-2">Email:</label>
        <input 
          type="email"
          value={form.email}
          onInput={(e) => form.email(e.target.value)}
          class={[
            'w-full px-3 py-2 border rounded',
            { 'border-red-500': () => !!errors.email() }
          ]}
        />
        {errors.email() && <span class="text-red-500 text-sm">{errors.email()}</span>}
      </div>
      
      <div class="mb-4">
        <label class="block text-gray-700 mb-2">Message:</label>
        <textarea
          value={form.message}
          onInput={(e) => form.message(e.target.value)}
          rows={4}
          class={[
            'w-full px-3 py-2 border rounded',
            { 'border-red-500': () => !!errors.message() }
          ]}
        />
        {errors.message() && <span class="text-red-500 text-sm">{errors.message()}</span>}
      </div>
      
      <button 
        type="submit" 
        disabled={isSubmitting()}
        class={[
          'w-full px-4 py-2 text-white rounded',
          () => isSubmitting() 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-blue-500 hover:bg-blue-600'
        ]}
      >
        {isSubmitting() ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  )
}
```

### Animation with useAnimationLoop

Creating animated elements:

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
    <div class={[
      'w-24 h-24 bg-blue-500 mx-auto mt-12',
      'transform transition-transform duration-75'
    ]} style={{
      transform: `rotate(${rotation()}rad) scale(${scale()})`
    }} />
  )
}
```

## Class Management Patterns

Woby provides powerful built-in class management that supports complex class expressions with full reactive observable support, similar to popular libraries like `classnames` and `clsx`.

### Array-based Classes

Use arrays to combine multiple classes, including conditional ones:

```
const Button = ({ variant, size, disabled, children }) => {
  return (
    <button class={[
      'px-4 py-2 rounded font-medium transition-colors',
      `btn-${variant}`, // Dynamic class
      `btn-${size}`,    // Dynamic class
      {
        'opacity-50 cursor-not-allowed': () => disabled,
        'hover:opacity-90': () => !disabled,
        'focus:ring-2 focus:ring-blue-500': true
      }
    ]}>
      {children}
    </button>
  )
}
```

### Complex Conditional Classes

Handle complex conditional logic with nested expressions:

``typescript
const StatusIndicator = ({ status, urgent, loading }) => {
  return (
    <div class={[
      'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
      () => {
        switch ($$(status)) {
          case 'success':
            return 'bg-green-100 text-green-800'
          case 'warning':
            return 'bg-yellow-100 text-yellow-800'
          case 'error':
            return 'bg-red-100 text-red-800'
          default:
            return 'bg-gray-100 text-gray-800'
        }
      },
      {
        'animate-pulse': () => loading,
        'border-2 border-red-500': () => urgent && $$(status) === 'error'
      }
    ]}>
      <span class={[
        'w-2 h-2 rounded-full mr-2',
        () => {
          switch ($$(status)) {
            case 'success':
              return 'bg-green-500'
            case 'warning':
              return 'bg-yellow-500'
            case 'error':
              return 'bg-red-500'
            default:
              return 'bg-gray-500'
          }
        }
      ]} />
      {status}
    </div>
  )
}
```

### Reactive Class Objects

Use objects for simple conditional classes where keys are class names and values are conditions:

```
const ProgressBar = ({ value, max, animated, striped }) => {
  const percentage = useMemo(() => (value / max) * 100)
  
  return (
    <div class="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
      <div 
        class={{
          'h-full rounded-full transition-all duration-300': true,
          'bg-blue-500': percentage < 70,
          'bg-yellow-500': percentage >= 70 && percentage < 90,
          'bg-red-500': percentage >= 90,
          'animate-stripes': () => striped,
          'transition-width': () => animated
        }}
        style={{ width: `${percentage}%` }}
      />
    </div>
  )
}
```

### Function-based Class Expressions

Compute classes dynamically using functions:

``typescript
const DataCard = ({ data, loading, error }) => {
  const cardClass = useMemo(() => [
    'border rounded-lg p-6 shadow-sm',
    () => {
      if ($$(loading)) return 'border-gray-200 bg-gray-50'
      if ($$(error)) return 'border-red-200 bg-red-50'
      return 'border-gray-200 bg-white hover:shadow-md'
    },
    { 'animate-pulse': () => loading }
  ])
  
  return (
    <div class={cardClass}>
      <If when={loading}>
        <div>Loading...</div>
      </If>
      <If when={error}>
        <div class="text-red-500">Error: {error.message}</div>
      </If>
      <If when={!loading && !error}>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </If>
    </div>
  )
}
```

### Integration with Tailwind CSS

Woby works seamlessly with Tailwind CSS for utility-first styling:

```typescript
const DashboardCard = ({ title, value, change, icon }) => {
  const isPositive = useMemo(() => $$(change) >= 0)
  
  return (
    <div class="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-500">{title}</p>
          <p class="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
        </div>
        <div class="p-3 rounded-lg bg-blue-100 text-blue-600">
          {icon}
        </div>
      </div>
      <div class={[
        'flex items-center mt-4 text-sm',
        () => $$(isPositive) ? 'text-green-600' : 'text-red-600'
      ]}>
        <span class={[
          'flex items-center',
          () => $$(isPositive) ? 'before:content-["▲"]' : 'before:content-["▼"]'
        ]}>
          {Math.abs(change)}%
        </span>
        <span class="ml-2 text-gray-500">from last month</span>
      </div>
    </div>
  )
}
```

### Important: Reactive Elements Must Be Wrapped

All reactive elements in class expressions should be wrapped in `useMemo` or arrow functions `() =>` to ensure proper reactivity:

```
// ❌ Incorrect - will not update reactively
const isActive = $(false)
<div class={{ 'active': isActive }}>Content</div> // This won't work as expected

// ✅ Correct - wrapped in arrow function
<div class={{ 'active': () => $$(isActive) }}>Content</div>

// ✅ Also correct - observables automatically handled in objects
<div class={{ 'active': isActive }}>Content</div> // This actually works

// ✅ Complex expression with useMemo
const dynamicClass = useMemo(() => ({
  'active': $$(isActive),
  'disabled': $$(isDisabled),
  'loading': $$(isLoading)
}))

<div class={dynamicClass}>Content</div>
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
    <form onSubmit={handleSubmit}>
      <div class="mb-4">
        <label class="block text-gray-700 mb-2">Name:</label>
        <input 
          ref={inputRef}
          value={form.name}
          onInput={(e) => form.name(e.target.value)}
          class="w-full px-3 py-2 border border-gray-300 rounded"
        />
        {errors.name() && <span class="text-red-500 text-sm">{errors.name()}</span>}
      </div>
      
      <div class="mb-4">
        <label class="block text-gray-700 mb-2">Email:</label>
        <input 
          type="email"
          value={form.email}
          onInput={(e) => form.email(e.target.value)}
          class={[
            'w-full px-3 py-2 border rounded',
            { 'border-red-500': () => !!errors.email() }
          ]}
        />
        {errors.email() && <span class="text-red-500 text-sm">{errors.email()}</span>}
      </div>
      
      <div class="mb-4">
        <label class="block text-gray-700 mb-2">Password:</label>
        <input 
          type="password"
          value={form.password}
          onInput={(e) => form.password(e.target.value)}
          class={[
            'w-full px-3 py-2 border rounded',
            { 'border-red-500': () => !!errors.password() }
          ]}
        />
        {errors.password() && <span class="text-red-500 text-sm">{errors.password()}</span>}
      </div>
      
      <button 
        type="submit" 
        disabled={isSubmitting()}
        class={[
          'w-full px-4 py-2 text-white rounded',
          () => isSubmitting() 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-blue-500 hover:bg-blue-600'
        ]}
      >
        {isSubmitting() ? 'Submitting...' : 'Submit'}
      </button>
    </form>
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

- **[Playground](https://codesandbox.io/s/playground-7w2pxg)** - Interactive environment
- **[Counter](https://codesandbox.io/s/demo-counter-23fv5)** - Basic counter
- **[Clock](https://codesandbox.io/s/demo-clock-w1e7yb)** - Real-time clock
- **[Boxes](https://codesandbox.io/s/demo-boxes-wx6rqb)** - Animated boxes
- **[Triangle](https://codesandbox.io/s/demo-triangle-l837v0)** - Performance test

**[View More Examples](https://github.com/wobyjs/demo)**