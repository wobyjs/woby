# React to Woby Type Conversion Guide

This document provides a comprehensive mapping of React types to their Woby equivalents, helping developers transition from React to Woby or understand how to work with both frameworks.

## Core Component and Element Types

| React Type | Woby Equivalent | Description |
|------------|-----------------|-------------|
| `React.ReactNode` | `JSX.Child` | Represents any renderable content |
| `React.FC<Props>` | `JSX.ComponentFunction<Props>` | Function component type |
| `React.Component` | N/A (Woby uses functional components) | Class components aren't used in Woby |
| `React.ComponentType<Props>` | `JSX.Component<Props>` | Union of function components and intrinsic elements |
| `React.PropsWithChildren<P>` | `P & { children?: JSX.Child }` | Props interface with children |
| `React.PropsWithoutRef<P>` | `P` | Props without ref (refs handled differently in Woby) |

## Hook Equivalents

| React Hook | Woby Equivalent | Notes |
|------------|-----------------|-------|
| `useState` | `$` (observable creator) | Woby uses observables instead of state setters |
| `useEffect` | `useEffect` | Automatic dependency tracking, no dependency array needed |
| `useMemo` | `useMemo` | Automatic dependency tracking, no dependency array needed |
| `useCallback` | Not needed | Functions are automatically optimized |
| `useRef` | Ref callbacks or `$<T>()` | Direct DOM access or observable refs |
| `useContext` | `useContext` | Similar API but with Woby's context system |

## Ref Handling

| React Pattern | Woby Equivalent | Description |
|---------------|-----------------|-------------|
| `useRef<T>(null)` | `$<T>()` | Observable ref for DOM access |
| `ref.current` | `$$()` | Accessing ref value |
| `MutableRefObject<T>` | `JSX.Ref<T>` | Ref type definition |

## Context Types

| React Type | Woby Equivalent | Description |
|------------|-----------------|-------------|
| `React.Context<T>` | `Woby.Context<T>` | Context object type |
| `React.ContextType<T>` | Inferred from `useContext` | Context value type |
| `React.Provider<T>` | `Context.Provider` | Context provider component |

## Event Types

| React Type | Woby Equivalent | Description |
|------------|-----------------|-------------|
| `React.MouseEvent<T>` | `JSX.TargetedMouseEvent<T>` | Mouse event type |
| `React.KeyboardEvent<T>` | `JSX.TargetedKeyboardEvent<T>` | Keyboard event type |
| `React.ChangeEvent<T>` | `JSX.TargetedChangeEvent<T>` | Change event type |
| `React.FormEvent<T>` | `JSX.TargetedEvent<T>` | Form event type |
| `React.FocusEvent<T>` | `JSX.TargetedFocusEvent<T>` | Focus event type |

## HTML and DOM Types

| React Type | Woby Equivalent | Description |
|------------|-----------------|-------------|
| `React.HTMLProps<T>` | `JSX.HTMLAttributes<T>` | HTML element props |
| `React.HTMLAttributes<T>` | `JSX.HTMLAttributes<T>` | HTML attributes |
| `React.CSSProperties` | `JSX.CSSProperties` | CSS properties object |
| `React.ReactNodeArray` | `JSX.Child[]` | Array of renderable nodes |
| `React.ReactPortal` | `JSX.Portal` | Portal component |

## HTML Utility Types

Woby provides a set of HTML utility types for handling common HTML attribute patterns:

| Woby Utility | Description |
|--------------|-------------|
| `HtmlBoolean` | Handles boolean values with automatic conversion |
| `HtmlNumber` | Handles numeric values with automatic conversion |
| `HtmlDate` | Handles Date values with ISO string serialization |
| `HtmlBigInt` | Handles BigInt values with automatic conversion |
| `HtmlObject` | Handles Object values with JSON serialization |
| `HtmlLength` | Handles CSS length values (px, em, rem, %, etc.) |
| `HtmlBox` | Handles CSS box values (margin, padding, border, etc.) |
| `HtmlColor` | Handles CSS color values (hex, rgb, etc.) |
| `HtmlStyle` | Handles CSS style values (objects and strings) |

### Usage Example

``tsx
// Woby with HTML utilities
import { $, HtmlBoolean, HtmlNumber, HtmlColor } from 'woby'

interface Props {
  enabled?: boolean
  count?: number
  color?: string
}

const def = () => ({
  enabled: $(false, HtmlBoolean),
  count: $(0, HtmlNumber),
  color: $('#000000', HtmlColor)
})
```

## State and Dispatch Types

| React Type | Woby Equivalent | Description |
|------------|-----------------|-------------|
| `React.Dispatch<A>` | Observable setter pattern | State update function |
| `React.SetStateAction<S>` | `(prev: S) => S` or `S` | State update value or function |

## Component Definition Patterns

### React Function Component
```tsx
// React
interface Props {
  name: string;
  age?: number;
}

const MyComponent: React.FC<Props> = ({ name, age = 0, children }) => {
  return (
    <div>
      <h1>Hello {name}</h1>
      <p>Age: {age}</p>
      {children}
    </div>
  );
};
```

### Woby Function Component
```tsx
// Woby
interface Props {
  name: string;
  age?: number;
  children?: JSX.Child;
}

const MyComponent: JSX.ComponentFunction<Props> = ({ name, age = 0, children }) => {
  return (
    <div>
      <h1>Hello {name}</h1>
      <p>Age: {age}</p>
      {children}
    </div>
  );
};
```

## State Management

### React State
```tsx
// React
const [count, setCount] = useState(0);
const increment = () => setCount(count + 1);
```

### Woby State
```tsx
// Woby
const count = $(0);
const increment = () => count(count() + 1);
// Or with automatic unwrapping in reactive contexts:
const increment = () => count($$(count) + 1);
```

## Effect Management

### React Effect
```tsx
// React
useEffect(() => {
  console.log('Count changed:', count);
}, [count]);
```

### Woby Effect
```tsx
// Woby - automatic dependency tracking
useEffect(() => {
  console.log('Count changed:', $$(count));
});
```

## Key Differences Summary

1. **Reactivity System**: Woby uses observables instead of state setters
2. **Dependency Tracking**: Woby automatically tracks dependencies, no arrays needed
3. **Refs**: Woby uses direct function refs or observable-based refs without `.current`
4. **Hooks Rules**: Woby hooks can be conditional or nested (no strict rules)
5. **Performance**: Woby provides fine-grained updates through observables
6. **Component Types**: Woby focuses on functional components, no class components

## Migration Tips

1. Replace `useState` with `$()` for observable state
2. Remove dependency arrays from `useEffect` and `useMemo`
3. Use `$$()` to access observable values in reactive contexts
4. Replace `useRef` with observable refs or direct ref callbacks
5. Use Woby's built-in control flow components (`If`, `For`, `Switch`) instead of JavaScript conditionals
6. Replace class components with functional components

## Example Migrations

### Simple Counter Component

**React:**
```tsx
import React, { useState } from 'react';

interface CounterProps {
  initialCount?: number;
}

const Counter: React.FC<CounterProps> = ({ initialCount = 0 }) => {
  const [count, setCount] = useState(initialCount);
  
  const increment = () => setCount(prev => prev + 1);
  const decrement = () => setCount(prev => prev - 1);
  
  return (
    <div>
      <h2>Count: {count}</h2>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </div>
  );
};

export default Counter;
```

**Woby:**
```tsx
import { $, $$ } from 'woby';
import type { JSX } from 'woby';

interface CounterProps {
  initialCount?: number;
  children?: JSX.Child;
}

const Counter: JSX.ComponentFunction<CounterProps> = ({ initialCount = 0, children }) => {
  const count = $(initialCount);
  
  const increment = () => count($$(count) + 1);
  const decrement = () => count($$(count) - 1);
  
  return (
    <div>
      <h2>Count: {count}</h2>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      {children}
    </div>
  );
};

export default Counter;
```

### Todo List Component

**React:**
```tsx
import React, { useState } from 'react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

interface TodoListProps {
  initialTodos?: Todo[];
}

const TodoList: React.FC<TodoListProps> = ({ initialTodos = [] }) => {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [inputValue, setInputValue] = useState('');
  
  const addTodo = () => {
    if (inputValue.trim()) {
      setTodos(prev => [
        ...prev,
        {
          id: Date.now(),
          text: inputValue,
          completed: false
        }
      ]);
      setInputValue('');
    }
  };
  
  const toggleTodo = (id: number) => {
    setTodos(prev => 
      prev.map(todo => 
        todo.id === id 
          ? { ...todo, completed: !todo.completed }
          : todo
      )
    );
  };
  
  const removeTodo = (id: number) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };
  
  return (
    <div>
      <input 
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        onKeyPress={e => e.key === 'Enter' && addTodo()}
      />
      <button onClick={addTodo}>Add</button>
      
      <ul>
        {todos.map(todo => (
          <li key={todo.id} style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            <span>{todo.text}</span>
            <button onClick={() => removeTodo(todo.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
```

**Woby:**
```tsx
import { $, $$, For } from 'woby';
import type { JSX } from 'woby';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

interface TodoListProps {
  initialTodos?: Todo[];
  children?: JSX.Child;
}

const TodoList: JSX.ComponentFunction<TodoListProps> = ({ initialTodos = [], children }) => {
  const todos = $(initialTodos);
  const inputValue = $('');
  
  const addTodo = () => {
    const text = $$(inputValue).trim();
    if (text) {
      todos(prev => [
        ...prev,
        {
          id: Date.now(),
          text,
          completed: false
        }
      ]);
      inputValue('');
    }
  };
  
  const toggleTodo = (id: number) => {
    todos(prev => 
      prev.map(todo => 
        todo.id === id 
          ? { ...todo, completed: !$$(todo.completed) }
          : todo
      )
    );
  };
  
  const removeTodo = (id: number) => {
    todos(prev => prev.filter(todo => todo.id !== id));
  };
  
  return (
    <div>
      <input 
        value={inputValue}
        onInput={e => inputValue(e.target.value)}
        onKeyPress={e => e.key === 'Enter' && addTodo()}
      />
      <button onClick={addTodo}>Add</button>
      
      <ul>
        <For values={todos}>
          {todo => (
            <li style={{ textDecoration: () => $$(todo).completed ? 'line-through' : 'none' }}>
              <input
                type="checkbox"
                checked={() => $$(todo).completed}
                onChange={() => toggleTodo($$(todo).id)}
              />
              <span>{$(todo).text}</span>
              <button onClick={() => removeTodo($$(todo).id)}>Remove</button>
            </li>
          )}
        </For>
      </ul>
      
      {children}
    </div>
  );
};

export default TodoList;
```