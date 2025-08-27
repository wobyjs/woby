# Woby vs React: API Differences

This document highlights the key differences between Woby and React APIs, focusing on the most commonly used hooks and patterns. Understanding these differences is crucial for developers transitioning from React to Woby or comparing the two frameworks.

## Table of Contents

- [Core Philosophy Differences](#core-philosophy-differences)
- [Hook API Differences](#hook-api-differences)
  - [useRef vs Ref Handling](#useref-vs-ref-handling)
  - [useMemo](#usememo)
  - [useEffect](#useeffect)
  - [useCallback](#usecallback)
  - [forwardRef](#forwardref)
- [Summary of Key Differences](#summary-of-key-differences)

## Core Philosophy Differences

| Aspect | React | Woby |
|--------|-------|------|
| Reactivity System | State-based with VDOM | Observable-based with direct DOM manipulation |
| Dependency Management | Manual dependency arrays | Automatic dependency tracking |
| Hook Rules | Strict rules (top-level only, no conditionals) | Flexible hooks (can be conditional, nested, etc.) |
| Performance | VDOM diffing and reconciliation | Fine-grained reactivity |
| Build Process | Often requires Babel transforms | Works with plain JavaScript |

## Hook API Differences

### useRef vs Ref Handling

**React:**
```jsx
import { useRef } from 'react';

function MyComponent() {
  const inputRef = useRef(null);
  
  const focusInput = () => {
    inputRef.current.focus();
  };
  
  return <input ref={inputRef} />;
}
```

**Woby:**
```tsx
import { $, $$ } from 'woby';
import type { Ref } from 'woby';

// Observable-based approach (Woby preferred)
const inputRef = $<HTMLInputElement>();
const focusInput = () => {
  $$(inputRef)?.focus();
};

function MyComponent() {
  return <input ref={inputRef} />;
}
```

**Key Differences:**
- Woby supports both traditional ref callbacks and observable-based refs
- Observable-based refs eliminate the need for `.current` property
- More direct access to DOM nodes with less boilerplate

### useMemo

**React:**
```jsx
import { useMemo } from 'react';

function MyComponent({ a, b }) {
  const expensiveValue = useMemo(() => {
    return computeExpensiveValue(a, b);
  }, [a, b]); // Dependency array required
  
  return <div>{expensiveValue}</div>;
}
```

**Woby:**
```tsx
import { useMemo } from 'woby';

function MyComponent({ a, b }) {
  const expensiveValue = useMemo(() => {
    return computeExpensiveValue(a, b);
  }); // No dependency array needed
  
  return <div>{expensiveValue}</div>;
}
```

**Key Differences:**
- Woby automatically tracks dependencies - no need for dependency arrays
- Simpler API with less boilerplate
- Less prone to bugs from missing or incorrect dependencies

### useEffect

**React:**
```jsx
import { useEffect } from 'react';

function MyComponent() {
  useEffect(() => {
    console.log('Component mounted or updated');
    
    return () => {
      console.log('Component will unmount');
    };
  }, []); // Dependency array controls when effect runs
  
  return <div>Hello World</div>;
}
```

**Woby:**
```tsx
import { useEffect } from 'woby';

function MyComponent() {
  useEffect(() => {
    console.log('Component mounted or updated');
    
    return () => {
      console.log('Component will unmount');
    };
  }); // No dependency array needed
  
  return <div>Hello World</div>;
}
```

**Key Differences:**
- Woby automatically tracks what the effect depends on
- No need to manually specify dependencies
- Effect re-runs only when actual dependencies change

### useCallback

**React:**
```jsx
import { useCallback } from 'react';

function ParentComponent() {
  const handleClick = useCallback(() => {
    console.log('Button clicked');
  }, []); // Dependency array required
  
  return <ChildComponent onClick={handleClick} />;
}
```

**Woby:**
```tsx
// Woby doesn't have a direct useCallback equivalent
// Instead, it uses automatic dependency tracking:
import { useMemo } from 'woby';

const handleClick = (e) => {
    console.log('Button clicked');
  }

function ParentComponent() {
  return <ChildComponent onClick={handleClick} />;
}
```

**Key Differences:**
- Woby doesn't need `useCallback` because it has automatic dependency tracking
- Less API surface area to learn

### forwardRef

**React:**
```jsx
import { forwardRef } from 'react';

const FancyButton = forwardRef((props, ref) => (
  <button ref={ref} className="fancy-button">
    {props.children}
  </button>
));
```

**Woby:**
```tsx
import { $, $$ } from 'woby';
import type { Ref } from 'woby';

interface FancyButtonProps {
  children: any;
  ref?: Ref<HTMLButtonElement>;
}

// Method 1: Pass ref as regular prop (no special API needed)
const FancyButton = ({ children, ref }: FancyButtonProps) => (
  <button ref={ref} className="fancy-button">
    {children}
  </button>
);

// Method 2: Observable-based ref handling
const FancyButtonWithObservableRef = ({ children }: { children: any }) => {
  const buttonRef = $<HTMLButtonElement>();
  
  // Can access the ref internally if needed
  const doSomething = () => {
    $$(buttonRef)?.focus();
  };
  
  return (
    <div>
      <button ref={buttonRef} className="fancy-button">
        {children}
      </button>
      <button onClick={doSomething}>Focus Button</button>
    </div>
  );
};
```

**Key Differences:**
- Woby doesn't need a special `forwardRef` function
- Refs are passed as regular props
- Observable-based refs provide more flexibility

## Summary of Key Differences

1. **No Dependency Arrays**: Woby's automatic dependency tracking eliminates the need for dependency arrays in `useMemo` and `useEffect`.

2. **Simpler Ref Handling**: Woby uses direct function refs and observable-based refs instead of ref objects with `.current`.

3. **No useCallback**: Woby's automatic tracking makes `useCallback` unnecessary.

4. **No forwardRef**: Refs are passed as regular props in Woby.

5. **Automatic Optimization**: Woby's observable-based system automatically optimizes re-renders based on actual data dependencies rather than manual dependency management.

6. **Flexible Hooks**: Woby hooks can be called conditionally, nested, or outside components, unlike React's strict rules.

These differences make Woby's API simpler and less error-prone while maintaining high performance through fine-grained reactivity. The framework's design philosophy prioritizes developer experience and performance by eliminating common sources of bugs and boilerplate code found in traditional frameworks.