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
- [Dependency Management](#dependency-management)
- [Advanced Features](#advanced-features)
  - [Nested Property Support](#nested-property-support)
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

// Method 1: Traditional ref callback (similar to React)
const inputRefCallback: Ref<HTMLInputElement> = (element) => {
  // element is the actual DOM node
  if (element) {
    element.focus();
  }
};

// Method 2: Observable-based approach (Woby preferred)
const inputRef = $<HTMLInputElement>();
const focusInput = () => {
  $$(inputRef)?.focus();
};

function MyComponent() {
  return <input ref={inputRef} />;
}
```

**Type Equivalence:**
- React's `MutableRefObject<T>` corresponds to Woby's `JSX.Ref<T>`
- React's `useRef` hook concept corresponds to Woby's ref handling approach
- Woby refs provide direct access to DOM elements without requiring a `.current` property

**Key Differences:**
- Woby supports both traditional ref callbacks and observable-based refs
- Observable-based refs provide direct access to DOM elements without a `.current` property
- Woby enables more direct access to DOM nodes with less boilerplate
- Woby integrates ref handling into the framework's observable system rather than providing a separate `useRef` hook

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
// Woby provides automatic dependency tracking
// This eliminates the need for a direct useCallback equivalent:

// Method 1: Simple function (no memoization needed)
const handleClick = (e) => {
  console.log('Button clicked');
};

// Method 2: If memoization is truly needed
import { useMemo } from 'woby';

const handleClick = useMemo(() => {
  return (e) => {
    console.log('Button clicked');
  };
});

function ParentComponent() {
  return <ChildComponent onClick={handleClick} />;
}
```

**Key Differences:**
- Woby provides automatic dependency tracking, offering a streamlined approach without requiring explicit `useCallback`
- `useMemo` can serve a similar purpose when you need to memoize functions
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
- Woby simplifies ref handling without requiring a special `forwardRef` function
- Refs are passed as regular props
- Observable-based refs provide more flexibility

## Dependency Management

One of the most significant differences between React and Woby is how dependencies are managed in reactive code.

### React Dependency Arrays

In React, you must explicitly specify dependencies in arrays for hooks like `useEffect`, `useMemo`, and `useCallback`:

```jsx
import { useEffect, useMemo, useCallback, useState } from 'react';

function MyComponent({ userId, theme }) {
  const [data, setData] = useState(null);
  
  // useEffect with dependency array
  useEffect(() => {
    fetchData(userId).then(setData);
  }, [userId]); // Must specify userId as dependency
  
  // useMemo with dependency array
  const processedData = useMemo(() => {
    return process(data, theme);
  }, [data, theme]); // Must specify all dependencies
  
  // useCallback with dependency array
  const handleClick = useCallback(() => {
    console.log('User ID:', userId);
  }, [userId]); // Must specify userId as dependency
  
  return <div>{/* ... */}</div>;
}
```

### Woby Automatic Tracking

In Woby, dependencies are automatically tracked when you access observables using `$$()`:

```tsx
import { $, $$, useEffect, useMemo } from 'woby';

function MyComponent({ userId, theme }) {
  const data = $<any>(null);
  
  // useEffect with automatic dependency tracking
  useEffect(() => {
    fetchData($$(userId)).then(data); // $$() tracks userId automatically
  }); // No dependency array needed
  
  // useMemo with automatic dependency tracking
  const processedData = useMemo(() => {
    return process($$(data), $$(theme)); // $$() tracks both data and theme
  }); // No dependency array needed
  
  // No useCallback needed - functions are automatically optimized
  const handleClick = () => {
    console.log('User ID:', $$(userId)); // $$() tracks userId automatically
  };
  
  return <div>{/* ... */}</div>;
}
```

### Declaring Reactive Dependencies with `$()`

In Woby, you must declare your reactive variables using `$()` to make them trackable:

```tsx
import { $, $$, useEffect, useMemo } from 'woby';

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

// Event handlers can access current values
const handleClick = () => {
  count($$(count) + 1); // Increment the observable
};
```

**Key Points:**
- Variables must be declared with `$()` to be reactive and trackable
- Access values with `$$()` in reactive contexts for automatic dependency tracking
- Plain variables won't trigger reactivity even if changed

## Advanced Features

### Nested Property Support

One of Woby's standout features is its advanced nested property support, which allows you to set deeply nested properties directly through HTML attributes. This feature is not available in React or SolidJS.

**Woby:**
```html
<!-- Set nested properties using $ notation (works in both HTML and JSX) -->
<user-card 
  user$name="John Doe"
  user$details$age="30"
  style$font-size="1.2em"
  style$color="blue">
</user-card>

<!-- Set nested properties using . notation (HTML only) -->
<user-card 
  user.name="John Doe"
  user.details.age="30"
  style.font-size="1.2em"
  style.color="blue">
</user-card>
```

In Woby custom elements, you can set deeply nested properties directly through HTML attributes using both `$` and `.` notation:

1. **$ Notation**: Works in both HTML and JSX (`user$details$age`)
2. **. Notation**: Works only in HTML (`user.details.age`)
3. **Automatic Kebab-Case Conversion**: Property names are automatically converted from kebab-case to camelCase (`font-size` becomes `fontSize`)

This feature provides several advantages over traditional frameworks:

1. **Direct Property Setting**: Unlike React where you need to pass complex objects as props, Woby allows you to directly set nested properties through HTML attributes
2. **HTML Compatibility**: You can set deeply nested properties directly in HTML without any JavaScript
3. **Framework Uniqueness**: This level of nested property support is not available in React or SolidJS

**React Comparison:**
```jsx
// React requires passing complex objects as props
<UserCard 
  user={{
    name: "John Doe",
    details: {
      age: 30
    }
  }}
  style={{
    fontSize: "1.2em",
    color: "blue"
  }}
/>
```

**SolidJS Comparison:**
```jsx
// SolidJS also requires passing complex objects as props
<UserCard 
  user={{
    name: "John Doe",
    details: {
      age: 30
    }
  }}
  style={{
    fontSize: "1.2em",
    color: "blue"
  }}
/>
```

With Woby, you can achieve the same result directly in HTML:
```html
<user-card 
  user$name="John Doe"
  user$details$age="30"
  style$font-size="1.2em"
  style$color="blue">
</user-card>
```

This makes Woby custom elements significantly more powerful and flexible than components in React or SolidJS, especially for use cases where you want to configure components directly in HTML without requiring JavaScript initialization.

## Key Points About Dependency Management

1. **Automatic Tracking**: In Woby, whenever you use `$$()` to unwrap an observable inside a reactive context (like `useEffect` or `useMemo`), that observable is automatically tracked as a dependency.

2. **Automatic Management**: Woby automatically manages dependency arrays, reducing potential sources of bugs compared to React applications.

3. **Reactive Context**: The tracking only happens within reactive contexts (functions passed to `useEffect`, `useMemo`, etc.). Outside these contexts, `$$()` simply unwraps the value without tracking.

4. **Performance**: Woby's approach is often more performant because it only tracks actual dependencies that are accessed, rather than requiring developers to manually specify them.

5. **Migration Pattern**: When migrating from React to Woby, replace each dependency in arrays with `$$()` calls in the function body, and ensure dependencies are declared with `$()`:

   ```jsx
   // React
   const [userId, setUserId] = useState(123);
   useEffect(() => {
     console.log(userId);
   }, [userId]);
   
   // Woby
   const userId = $(123); // Declare with $() for reactivity
   useEffect(() => {
     console.log($$(userId)); // Access with $$() for tracking
   });
   ```

## Summary of Key Differences

1. **Automatic Dependency Tracking**: Woby's automatic dependency tracking provides a streamlined approach to managing dependencies in `useMemo` and `useEffect`.

2. **Simpler Ref Handling**: Woby uses direct function refs and observable-based refs instead of ref objects with `.current`.

3. **Streamlined Function Handling**: Woby's automatic tracking provides a simplified approach to function optimization without requiring explicit `useCallback`.

4. **Simplified Ref Handling**: Refs are passed as regular props in Woby, providing a more straightforward approach.

5. **Automatic Optimization**: Woby's observable-based system automatically optimizes re-renders based on actual data dependencies rather than manual dependency management.

6. **Flexible Hooks**: Woby hooks can be called conditionally, nested, or outside components, unlike React's strict rules.

7. **Advanced Nested Property Support**: Woby's unique nested property support allows direct setting of deeply nested properties through HTML attributes, a feature not available in React or SolidJS.

These differences make Woby's API streamlined and robust while maintaining high performance through fine-grained reactivity. The framework's design philosophy prioritizes developer experience and performance by reducing common sources of bugs and boilerplate code found in traditional frameworks.