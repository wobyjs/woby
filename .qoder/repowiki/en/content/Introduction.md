# Introduction

<cite>
**Referenced Files in This Document**   
- [readme.md](file://readme.md)
- [src/index.ts](file://src/index.ts)
- [src/soby.ts](file://src/soby.ts)
- [docs/Class-Management.md](file://docs/Class-Management.md)
- [docs/Woby-vs-React.md](file://docs/Woby-vs-React.md)
- [docs/Reactivity-System.md](file://docs/Reactivity-System.md)
- [docs/demos/Counter-Demo.md](file://docs/demos/Counter-Demo.md)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Core Architectural Principles](#core-architectural-principles)
3. [Reactivity System](#reactivity-system)
4. [Key Differentiators from React-like Frameworks](#key-differentiators-from-react-like-frameworks)
5. [Built-in Features](#built-in-features)
6. [Relationship with Soby](#relationship-with-soby)
7. [Use Cases and Target Applications](#use-cases-and-target-applications)
8. [Component Structure and Rendering Patterns](#component-structure-and-rendering-patterns)

## Introduction

Woby is a high-performance, observable-based reactive framework designed for building rich web applications. It provides a modern approach to reactive programming by leveraging fine-grained reactivity without the overhead of a virtual DOM (VDOM). Built upon the Soby reactive core, Woby offers an enhanced API for component-based development that emphasizes performance, simplicity, and developer experience.

The framework follows a transparent philosophy where code behaves exactly as written, eliminating hidden transformations or unexpected behaviors. Unlike traditional frameworks that rely on VDOM diffing and reconciliation, Woby operates directly on DOM nodes, resulting in immediate and efficient updates. This client-focused framework is optimized for rich applications and currently prioritizes client-side functionality over server-related features like SSR or hydration.

Woby's architecture is centered around observables, signals, and reactivity, providing a powerful foundation for building dynamic user interfaces. The framework eliminates common pain points found in other systems, such as dependency arrays, rules of hooks, and props diffing, while introducing innovative features like advanced nested property support and built-in class management. With minimal dependencies and no requirement for Babel transforms, Woby delivers a lightweight solution that works with plain JavaScript and JSX.

**Section sources**
- [readme.md](file://readme.md#L1-L100)

## Core Architectural Principles

Woby's architecture is built on several fundamental principles that distinguish it from traditional frameworks:

### No VDOM
Woby eliminates the virtual DOM overhead by working directly with raw DOM nodes. This approach removes the need for diffing and reconciliation processes, resulting in immediate updates whenever attributes, properties, classes, or event handlers require modification. The direct DOM manipulation strategy ensures optimal performance by updating only the specific elements that change, rather than traversing and comparing entire component trees.

### Automatic Dependency Tracking
The framework automatically detects dependencies between reactive elements without requiring manual specification. When a reactive function accesses an observable, Woby's reactivity system tracks this relationship and ensures the function re-executes whenever the observed value changes. This eliminates the need for dependency arrays in hooks like `useEffect` and `useMemo`, reducing boilerplate code and potential bugs from incorrect dependency declarations.

### Direct DOM Manipulation
Instead of creating an intermediate representation of the UI, Woby applies changes directly to the DOM. This approach minimizes the performance overhead associated with VDOM diffing and patching operations. Updates are fine-grained and immediate, ensuring that only the necessary DOM mutations occur when state changes.

### No Props Diffing
Woby avoids the traditional props diffing process by updating attributes and properties directly and immediately when they change. This eliminates the computational cost of comparing previous and current props, resulting in more efficient updates.

### No Babel Transforms
The framework operates with plain JavaScript (plus JSX support) without requiring Babel transforms. This eliminates transform-related bugs and simplifies the development toolchain. The absence of code transformation ensures that what developers write is exactly what runs in the browser.

### Minimal Dependencies
Woby is designed with a focus on minimal third-party dependencies, providing a streamlined API for developers who prefer a lightweight solution. This approach reduces bundle size and potential compatibility issues while maintaining high performance.

**Section sources**
- [readme.md](file://readme.md#L101-L200)

## Reactivity System

Woby's reactivity system is built upon observables and provides fine-grained reactive updates. At its core, the system uses the `$()` function to create reactive observables that can track dependencies and notify subscribers when they change. These observables are similar to signals in other frameworks but offer a simple, intuitive API.

The framework automatically tracks which observables are accessed during function execution, creating a dependency graph that ensures components and effects update only when relevant data changes. This automatic dependency tracking eliminates the need for manual dependency arrays and reduces common sources of bugs found in other frameworks.

Woby's reactivity model includes several key components:

- **Observables**: Reactive values created with `$()` that can track dependencies and notify subscribers of changes
- **Computed Observables**: Derived values that automatically update when their dependencies change
- **Stores**: Reactive access to nested object properties
- **Batching**: The ability to batch multiple updates to prevent unnecessary re-renders

The system also includes enhanced observable functions with automatic `valueOf()` and `toString()` methods, allowing observables to behave more naturally in JavaScript contexts where primitives are expected. This enhancement enables automatic resolution in template literals, mathematical operations, and DOM attribute binding.

**Section sources**
- [docs/Reactivity-System.md](file://docs/Reactivity-System.md#L1-L100)
- [src/soby.ts](file://src/soby.ts#L1)

## Key Differentiators from React-like Frameworks

Woby differs significantly from React-like frameworks in several important ways:

### No Rules of Hooks
Unlike React, Woby's hooks are regular functions that can be nested indefinitely, called conditionally, and used outside components. This provides maximum flexibility for developers without the constraints of React's rules of hooks.

### No Dependency Arrays
Woby hooks like `useEffect` and `useMemo` do not require dependency arrays. The framework automatically tracks dependencies when observables are accessed, eliminating a common source of bugs in React applications.

### No Key Prop
Developers can map over arrays directly or use the `For` component with an array of unique values, eliminating the need to specify keys explicitly. This simplifies list rendering and reduces boilerplate code.

### Observable-Based Reactivity
While React relies on state-based reactivity with VDOM, Woby uses observable-based reactivity with direct DOM manipulation. This results in finer-grained updates and better performance characteristics.

### No Stale Closures
Functions in Woby are always executed afresh, eliminating issues with stale closures that can occur in React components.

The framework's approach to reactivity and component composition provides a streamlined development experience while maintaining high performance through fine-grained reactivity.

**Section sources**
- [readme.md](file://readme.md#L201-L300)
- [docs/Woby-vs-React.md](file://docs/Woby-vs-React.md#L1-L100)

## Built-in Features

Woby includes several powerful built-in features that enhance developer productivity and application performance:

### Built-in Class Management
The framework provides powerful built-in class management that supports complex class expressions similar to `classnames` and `clsx` libraries, with full reactive observable support. This eliminates the need for external dependencies while providing advanced functionality for managing CSS classes.

The class system supports:
- Array-based classes with conditional expressions
- Object-based classes with boolean conditions
- Function-based classes for dynamic computation
- Nested arrays and mixed types
- Reactive observables that automatically update when values change

### Advanced Nested Property Support
One of Woby's unique features is its advanced nested property support, allowing developers to set deeply nested properties directly through HTML attributes using both `$` and `.` notation. This capability is not available in React or SolidJS, making Woby particularly powerful for creating highly configurable custom elements.

For example:
```html
<user-card 
  user$name="John Doe"
  user$details$age="30"
  style$font-size="1.2em"
  style$color="blue">
</user-card>
```

### Web Components Support
Woby provides first-class support for creating and using custom elements with reactive properties. This enables seamless integration with the web components standard and allows components to be used directly in HTML without requiring JavaScript initialization.

### Advanced Context API
The framework offers a powerful context system that works seamlessly with both JSX components and custom elements, enabling efficient data sharing across component trees without prop drilling.

**Section sources**
- [readme.md](file://readme.md#L301-L400)
- [docs/Class-Management.md](file://docs/Class-Management.md#L1-L50)

## Relationship with Soby

Woby serves as a view layer built on top of the Observable library Soby. The relationship between these two libraries is fundamental to Woby's architecture and functionality.

Woby re-exports all Soby functionality with interfaces adjusted for component and hook usage, along with additional framework-specific functions. The `src/soby.ts` file contains the re-export statement `export * from 'soby'`, establishing the direct dependency between the two libraries.

The framework leverages Soby's core reactivity primitives while providing a higher-level API for building user interfaces. This layered architecture allows Woby to focus on component composition, rendering, and developer experience, while relying on Soby for the underlying reactive programming capabilities.

By building upon Soby, Woby inherits a proven reactivity system while adding its own unique features and abstractions for building web applications. This separation of concerns enables both libraries to evolve independently while maintaining compatibility.

**Section sources**
- [src/index.ts](file://src/index.ts#L1-L10)
- [src/soby.ts](file://src/soby.ts#L1)

## Use Cases and Target Applications

Woby is particularly well-suited for several types of applications:

### Rich Client-Side Applications
The framework excels at building rich, interactive client-side applications where performance and responsiveness are critical. Its direct DOM manipulation and fine-grained reactivity make it ideal for complex user interfaces with frequent state changes.

### Custom Elements and Web Components
Woby's first-class support for custom elements makes it an excellent choice for creating reusable web components that can be used across different frameworks or in vanilla HTML. The advanced nested property support and automatic attribute synchronization enable highly configurable components.

### Performance-Critical Applications
Applications where performance is paramount benefit from Woby's lack of VDOM overhead and fine-grained updates. The framework's efficient reactivity system ensures minimal unnecessary re-renders.

### Lightweight Applications
Projects that prioritize small bundle sizes and minimal dependencies can leverage Woby's lightweight nature and lack of build-time transformations.

### Progressive Enhancement
The ability to use Woby components directly in HTML makes it suitable for progressive enhancement scenarios where JavaScript functionality is added to existing HTML content.

**Section sources**
- [readme.md](file://readme.md#L401-L500)

## Component Structure and Rendering Patterns

Woby follows specific patterns for component structure and rendering that leverage its reactive system:

### Basic Component Structure
Components are typically defined as functions that return JSX elements. They use the `$()` function to create reactive state and automatically track dependencies when observables are accessed.

```tsx
const Counter = () => {
  const count = $(0)
  const increment = () => count(prev => prev + 1)
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+</button>
    </div>
  )
}
```

### Rendering Patterns
The framework provides several built-in components for common rendering patterns:

- **For**: For rendering lists of items
- **If**: For conditional rendering
- **Switch**: For multi-way conditional rendering
- **Portal**: For rendering content to different DOM nodes
- **Suspense**: For handling asynchronous operations

### Custom Element Registration
Components can be registered as custom elements using the `customElement` function, making them available for use in HTML:

```tsx
const Counter = defaults(() => ({
  value: $(0, { type: 'number' } as const),
  title: $('Counter')
}), ({ value, title }) => (
  <div>
    <h1>{title}</h1>
    <p>Count: {value}</p>
    <button onClick={() => value(prev => prev + 1)}>+</button>
  </div>
))

customElement('counter-element', Counter)
```

The framework's rendering patterns emphasize direct observable passing for simple reactive content and function expressions for complex computations, ensuring optimal performance and reactivity.

**Section sources**
- [docs/demos/Counter-Demo.md](file://docs/demos/Counter-Demo.md#L1-L100)
- [readme.md](file://readme.md#L501-L600)