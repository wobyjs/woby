# Quick Start

Get up and running with Woby in just a few minutes! This guide will walk you through creating your first Woby application.

## What You'll Build

We'll create a simple todo app that demonstrates Woby's core features:
- Reactive state with observables
- Component composition
- Event handling
- Dynamic lists
- Advanced class management

## Step 1: Create Your App

First, ensure you have [Woby installed](./Installation.md), then create your main application file:

```typescript
// src/App.tsx
import { $, For, render, useMemo } from 'woby'

interface Todo {
  id: number
  text: string
  completed: boolean
}

const TodoApp = () => {
  // Observable state
  const todos = $<Todo[]>([])
  const input = $('')
  const filter = $('all') // all, active, completed

  // Actions
  const addTodo = () => {
    const text = $$(input).trim()
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
      todo.id === id 
        ? { ...todo, completed: !$$(todo.completed) }
        : todo
    ))
  }

  const removeTodo = (id: number) => {
    todos(prev => $$(prev).filter(todo => todo.id !== id))
  }

  const setFilter = (newFilter: string) => {
    filter(newFilter)
  }

  // Computed values
  const filteredTodos = useMemo(() => {
    const currentFilter = $$(filter)
    const currentTodos = $$(todos)
    
    if (currentFilter === 'active') {
      return currentTodos.filter(todo => !todo.completed)
    } else if (currentFilter === 'completed') {
      return currentTodos.filter(todo => todo.completed)
    }
    return currentTodos
  })

  const activeCount = useMemo(() => {
    return $$(todos).filter(todo => !todo.completed).length
  })

  return (
    <div class="todo-app max-w-md mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4 text-center">My Todo App</h1>
      
      {/* Add new todo */}
      <div class="flex gap-2 mb-4">
        <input
          type="text"
          value={input}
          onInput={(e) => input(e.target.value)}
          placeholder="Add a new todo..."
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          class="flex-1 p-2 border border-gray-300 rounded"
        />
        <button 
          onClick={addTodo}
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add
        </button>
      </div>

      {/* Filter buttons */}
      <div class="flex justify-center gap-2 mb-4">
        {['all', 'active', 'completed'].map((filterName) => (
          <button
            key={filterName}
            onClick={() => setFilter(filterName)}
            class={[
              'px-3 py-1 rounded',
              () => $$(filter) === filterName 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 hover:bg-gray-300'
            ]}
          >
            {filterName.charAt(0).toUpperCase() + filterName.slice(1)}
          </button>
        ))}
      </div>

      {/* Todo list */}
      <ul class="list-none p-0">
        <For values={filteredTodos}>
          {(todo) => (
            <li class={[
              'flex items-center p-2 border-b border-gray-200 gap-2',
              { 
                'line-through text-gray-500': todo.completed,
                'bg-yellow-50': () => todo.id % 2 === 0  // Alternate row styling
              }
            ]}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                class="w-4 h-4"
              />
              <span class="flex-1">{todo.text}</span>
              <button 
                class="w-6 h-6 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600 text-xs"
                onClick={() => removeTodo(todo.id)}
              >
                ✕
              </button>
            </li>
          )}
        </For>
      </ul>

      {/* Stats */}
      <div class="mt-4 p-2 bg-gray-100 rounded text-sm">
        Total: {() => $$(todos).length} | 
        Active: {activeCount} |
        Completed: {() => $$(todos).filter(t => t.completed).length}
      </div>
    </div>
  )
}

// Render the application
render(<TodoApp />, document.getElementById('app')!)
```

## Step 2: Add Some Styling

Create a CSS file to enhance the visual presentation:

```
/* src/styles.css */
.todo-app {
  max-width: 500px;
  margin: 2rem auto;
  padding: 1rem;
  font-family: system-ui, sans-serif;
}

.flex {
  display: flex;
}

.flex-1 {
  flex: 1;
}

.gap-2 {
  gap: 0.5rem;
}

.items-center {
  align-items: center;
}

.p-2 {
  padding: 0.5rem;
}

.p-4 {
  padding: 1rem;
}

.m-4 {
  margin: 1rem;
}

.mb-4 {
  margin-bottom: 1rem;
}

.border {
  border: 1px solid #ddd;
}

.border-b {
  border-bottom: 1px solid #eee;
}

.rounded {
  border-radius: 4px;
}

.rounded-full {
  border-radius: 50%;
}

.bg-blue-500 {
  background: #007bff;
}

.bg-gray-100 {
  background: #f8f9fa;
}

.bg-gray-200 {
  background: #e9ecef;
}

.bg-red-500 {
  background: #dc3545;
}

.text-white {
  color: white;
}

.text-gray-500 {
  color: #666;
}

.text-sm {
  font-size: 0.9rem;
}

.text-xs {
  font-size: 0.75rem;
}

.text-center {
  text-align: center;
}

.text-2xl {
  font-size: 1.5rem;
}

.font-bold {
  font-weight: bold;
}

.cursor-pointer {
  cursor: pointer;
}

.hover\:bg-blue-600:hover {
  background: #0069d9;
}

.hover\:bg-gray-300:hover {
  background: #dee2e6;
}

.hover\:bg-red-600:hover {
  background: #c82333;
}

.max-w-md {
  max-width: 500px;
}

.mx-auto {
  margin-left: auto;
  margin-right: auto;
}

.list-none {
  list-style: none;
}

.w-4 {
  width: 1rem;
}

.h-4 {
  height: 1rem;
}

.w-6 {
  width: 1.5rem;
}

.h-6 {
  height: 1.5rem;
}

.justify-center {
  justify-content: center;
}

.line-through {
  text-decoration: line-through;
}
```

## Step 3: Update Your HTML

```
<!DOCTYPE html>
<html>
<head>
    <title>Todo App - Woby</title>
    <link rel="stylesheet" href="./src/styles.css">
</head>
<body>
    <div id="app"></div>
    <script type="module" src="./src/App.tsx"></script>
</body>
</html>
```

## Advanced Class Management

Woby provides powerful built-in class management that supports complex class expressions with full reactive observable support.

### Class Array Support

Woby supports complex class expressions including arrays, objects, and functions:

```
// Array of classes
<div class={['red', 'bold']}>Text</div>

// Nested arrays
<div class={['red', ['bold', ['italic']]]}>Text</div>

// Mixed types with reactive expressions
<div class={[
  "base-class",
  () => $$(value) % 2 === 0 ? "even" : "odd",
  { hidden: () => $$(isVisible) === false, italic: false },
  ['additional', ['nested', 'classes']]
]}>Complex classes</div>
```

### Reactive Classes

All class expressions support reactive observables that automatically update when values change:

```
const isActive = $(false)
const theme = $('dark')
const error = $(false)

// Reactive boolean
<div class={{ active: isActive, error: error }}>Toggle me</div>

// Reactive string
<div class={() => `btn btn-${theme()}`}>Themed button</div>

// Complex reactive expression
<div class={[
  'base-class',
  () => isActive() ? 'active' : 'inactive',
  { 'loading': () => $$(loadingState) }
]}>Dynamic element</div>
```

### Class Object Syntax

Woby supports object syntax for conditional classes where keys are class names and values are boolean conditions:

```
const error = $(false)
const warning = $(false)

<div class={{
  'base': true,           // Always applied
  'error': error,         // Applied when error is truthy
  'warning': warning,     // Applied when warning is truthy
  'success': () => !$$(error) && !$$(warning)  // Applied when neither error nor warning
}}>Status element</div>
```

### Function-based Classes

Classes can be computed using functions that return class strings or other class expressions:

```
const count = $(0)

<div class={() => count() > 5 ? 'high-count' : 'low-count'}>
  Count: {count}
</div>

// Function returning complex expression
<div class={() => [
  'base',
  count() > 10 ? 'large' : 'small',
  { 'even': () => count() % 2 === 0 }
]}>
  Dynamic element
</div>
```

### Important: Reactive Elements Must Be Wrapped

All reactive elements in class expressions should be wrapped in `useMemo` or arrow functions `() =>` to ensure proper reactivity:

```
// Correct - wrapped in arrow function
<div class={() => isActive() ? 'active' : 'inactive'}>Content</div>

// Correct - observables automatically handled in objects
<div class={{ 'active': isActive }}>Content</div>

// Correct - complex expression with useMemo
const dynamicClass = useMemo(() => ({
  'active': $$(isActive),
  'disabled': $$(isDisabled),
  'loading': $$(isLoading)
}))

<div class={dynamicClass}>Content</div>
```

## Key Concepts Demonstrated

### 1. **Observables ($)**

```typescript
const todos = $<Todo[]>([])  // Creates reactive state
const input = $('')          // String observable
```

### 2. **Reactive Updates**

```typescript
todos(prev => [...prev, newTodo])  // State updates trigger re-renders
```

### 3. **Dynamic Rendering**

```typescript
<For values={todos}>
  {(todo) => <li>...</li>}
</For>
```

### 4. **Event Handling**

```typescript
<button onClick={addTodo}>Add</button>
<input onInput={(e) => input(e.target.value)} />
```

### 5. **Advanced Class Management**

```typescript
<div class={[
  "base-class",
  () => $$(isActive) ? "active" : "inactive",
  { "error": () => $$(hasError) }
]}>Content</div>
```

## What's Happening?

1. **Observables**: $() creates reactive state that automatically updates the UI when changed
2. **No Virtual DOM**: Woby directly updates DOM nodes for maximum performance
3. **Fine-grained Updates**: Only the specific parts that changed get re-rendered
4. **Automatic Dependency Tracking**: Woby knows what depends on what without manual declarations
5. **Built-in Class Management**: Complex class expressions with full reactive support

## Try It Out!

1. Add some todos
2. Mark them as completed
3. Delete todos
4. Filter todos by status
5. Watch the stats update automatically
6. Notice how class expressions update based on state changes

Notice how everything stays in sync without any manual work - that's Woby's reactive system in action!

## Next Steps

Now that you've built your first Woby application, explore these topics:

- [Reactivity System](./Reactivity-System.md) - Deep dive into observables
- [Components](./Components.md) - Learn about component patterns
- [Hooks](./Hooks.md) - Discover built-in utilities
- [Examples](./Examples.md) - See more complex applications

## Complete Example

You can find this complete todo application and many others in our [examples gallery](./Examples.md) or check out the [live demos](https://github.com/wongchichong/demo).