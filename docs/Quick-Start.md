# Quick Start

Get up and running with Woby in just a few minutes! This guide will walk you through creating your first Woby application.

## What You'll Build

We'll create a simple todo app that demonstrates Woby's core features:
- Reactive state with observables
- Component composition
- Event handling
- Dynamic lists

## Step 1: Create Your App

First, ensure you have [Woby installed](./Installation.md), then create your main application file:

```typescript
// src/App.tsx
import { $, For, render } from 'woby'

interface Todo {
  id: number
  text: string
  completed: boolean
}

const TodoApp = () => {
  // Observable state
  const todos = $<Todo[]>([])
  const input = $('')

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

  return (
    <div class="todo-app">
      <h1>My Todo App</h1>
      
      {/* Add new todo */}
      <div class="input-section">
        <input
          type="text"
          value={input}
          onInput={(e) => input(e.target.value)}
          placeholder="Add a new todo..."
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
        />
        <button onClick={addTodo}>Add</button>
      </div>

      {/* Todo list */}
      <ul class="todo-list">
        <For values={todos}>
          {(todo) => (
            <li class={`todo-item ${todo.completed ? 'completed' : ''}`}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
              />
              <span class="todo-text">{todo.text}</span>
              <button 
                class="delete-btn"
                onClick={() => removeTodo(todo.id)}
              >
                ✕
              </button>
            </li>
          )}
        </For>
      </ul>

      {/* Stats */}
      <div class="stats">
        Total: {() => $$(todos).length} | 
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

```css
/* src/styles.css */
.todo-app {
  max-width: 500px;
  margin: 2rem auto;
  padding: 1rem;
  font-family: system-ui, sans-serif;
}

.input-section {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.input-section input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.input-section button {
  padding: 0.5rem 1rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.todo-list {
  list-style: none;
  padding: 0;
}

.todo-item {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  border-bottom: 1px solid #eee;
  gap: 0.5rem;
}

.todo-item.completed .todo-text {
  text-decoration: line-through;
  color: #666;
}

.todo-text {
  flex: 1;
}

.delete-btn {
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  font-size: 12px;
}

.stats {
  margin-top: 1rem;
  padding: 0.5rem;
  background: #f8f9fa;
  border-radius: 4px;
  font-size: 0.9rem;
}
```

## Step 3: Update Your HTML

```html
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

## What's Happening?

1. **Observables**: $() creates reactive state that automatically updates the UI when changed
2. **No Virtual DOM**: Woby directly updates DOM nodes for maximum performance
3. **Fine-grained Updates**: Only the specific parts that changed get re-rendered
4. **Automatic Dependency Tracking**: Woby knows what depends on what without manual declarations

## Try It Out!

1. Add some todos
2. Mark them as completed
3. Delete todos
4. Watch the stats update automatically

Notice how everything stays in sync without any manual work - that's Woby's reactive system in action!

## Next Steps

Now that you've built your first Woby application, explore these topics:

- [Reactivity System](./Reactivity-System.md) - Deep dive into observables
- [Components](./Components.md) - Learn about component patterns
- [Hooks](./Hooks.md) - Discover built-in utilities
- [Examples](./Examples.md) - See more complex applications

## Complete Example

You can find this complete todo application and many others in our [examples gallery](./Examples.md) or check out the [live demos](https://github.com/wongchichong/woby-demo).