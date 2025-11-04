# API Reference

<cite>
**Referenced Files in This Document**   
- [methods/index.ts](file://src/methods/index.ts)
- [components/index.ts](file://src/components/index.ts)
- [hooks/index.ts](file://src/hooks/index.ts)
- [types.ts](file://src/types.ts)
- [methods/render.ts](file://src/methods/render.ts)
- [methods/h.ts](file://src/methods/h.ts)
- [methods/custom_element.ts](file://src/methods/custom_element.ts)
- [hooks/use_context.ts](file://src/hooks/use_context.ts)
- [components/for.ts](file://src/components/for.ts)
- [components/if.ts](file://src/components/if.ts)
- [components/suspense.ts](file://src/components/suspense.ts)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Core Methods](#core-methods)
3. [Components API](#components-api)
4. [Hooks API](#hooks-api)
5. [Type Definitions](#type-definitions)
6. [Practical Examples](#practical-examples)
7. [Versioning and Compatibility](#versioning-and-compatibility)
8. [Conclusion](#conclusion)

## Introduction
This document provides comprehensive API documentation for Woby's public interfaces. It covers the core methods, components, hooks, and type definitions that form the foundation of the Woby framework. The documentation is designed to help developers understand and effectively use the Woby API for building reactive web applications.

**Section sources**
- [methods/index.ts](file://src/methods/index.ts)
- [components/index.ts](file://src/components/index.ts)
- [hooks/index.ts](file://src/hooks/index.ts)

## Core Methods

### render
The `render` function is used to render a child element into a parent DOM node. It returns a disposer function that can be used to clean up the rendered content.

**Signature:**
```typescript
function render(child: Child, parent?: Element | null | ShadowRoot): Disposer
```

**Parameters:**
- `child`: The child element to render
- `parent`: The parent DOM node to render into (optional)

**Returns:**
- `Disposer`: A function that cleans up the rendered content

**Behavior:**
- Throws an error if the parent node is invalid
- Clears the parent node's content before rendering
- Uses `useRoot` to manage the rendering lifecycle
- Returns a disposer function that cleans up the content when called

**Section sources**
- [methods/render.ts](file://src/methods/render.ts#L8-L29)

### h
The `h` function is a JSX-compatible function for creating elements. It serves as a bridge between JSX syntax and Woby's element creation system.

**Signature:**
```typescript
function h<P extends { children?: Child } = {}>(component: Component<P>, props?: Child | P | null, ...children: Child[]): Element
```

**Parameters:**
- `component`: The component to create an element for
- `props`: Properties to pass to the component
- `children`: Child elements

**Returns:**
- `Element`: The created element

**Behavior:**
- Delegates to `createElement` for actual element creation
- Handles both single child and multiple children cases
- Properly merges props and children

**Section sources**
- [methods/h.ts](file://src/methods/h.ts#L8-L23)

### createElement
The `createElement` function creates a new element from a component, props, and children. It handles different component types including functions, strings (HTML elements), and DOM nodes.

**Signature:**
```typescript
function createElement<P = { children?: Child }>(component: Component<P>, _props?: P | null, ..._children: Child[]): Element
```

**Parameters:**
- `component`: The component to create an element for
- `_props`: Properties to pass to the component
- `_children`: Child elements

**Returns:**
- `Element`: The created element

**Behavior:**
- Handles function components by calling them with props
- Creates HTML/SVG elements for string components
- Wraps DOM nodes directly
- Validates that children are not provided both as props and arguments

**Section sources**
- [methods/create_element.ts](file://src/methods/create_element.ts#L53-L129)

### customElement
The `customElement` function creates a custom HTML element that integrates with Woby's reactive system. It enables the creation of web components with reactive properties.

**Signature:**
```typescript
function customElement<P extends { children?: Observable<JSX.Child> }>(tagName: string, component: JSX.Component<P>): CustomElementConstructor
```

**Parameters:**
- `tagName`: The HTML tag name for the custom element
- `component`: The component function that renders the element's content

**Returns:**
- `CustomElementConstructor`: The custom element class

**Features:**
- Automatic attribute to prop mapping
- Type conversion for observable props
- Nested property support (e.g., 'nested$prop$value')
- Style property support (e.g., 'style$font-size')
- Shadow DOM encapsulation with optional stylesheet adoption
- Context support for custom elements

**Behavior:**
- Requires default props defined with the `defaults` helper
- Observes attribute changes and updates corresponding props
- Handles type conversion based on observable options
- Supports custom serialization with `toHtml` and `fromHtml` options
- Prevents properties with `{ toHtml: () => undefined }` from appearing in HTML attributes

**Section sources**
- [methods/custom_element.ts](file://src/methods/custom_element.ts#L452-L641)

## Components API

### For
The `For` component efficiently renders lists with fine-grained updates.

**Signature:**
```typescript
function For<T>({ values, fallback, unkeyed, children }: { 
  values: FunctionMaybe<readonly T[]>, 
  fallback?: Child, 
  unkeyed?: boolean, 
  children: ((value: T | Indexed<T>, index: FunctionMaybe<number>) => Child) 
}): ObservableReadonly<Child>
```

**Parameters:**
- `values`: The array of values to iterate over
- `fallback`: Content to display when values is empty
- `unkeyed`: Whether to use unkeyed iteration
- `children`: Render function for each item

**Behavior:**
- Delegates to Soby's `for` function
- Supports both keyed and unkeyed iteration
- Provides index as a function for reactivity

**Section sources**
- [components/for.ts](file://src/components/for.ts#L8-L12)

### If
The `If` component conditionally renders content based on a condition.

**Signature:**
```typescript
const If = <T>({ when, fallback, children }: { 
  when: FunctionMaybe<T>, 
  fallback?: Child, 
  children: Child | ((value: (() => Truthy<T>)) => Child) 
}): ObservableReadonly<Child>
```

**Parameters:**
- `when`: The condition to evaluate
- `fallback`: Content to display when condition is falsy
- `children`: Content to display when condition is truthy

**Behavior:**
- Supports both direct children and render function patterns
- Uses `useGuarded` to handle truthy checks
- Delegates to `ternary` for actual conditional rendering

**Section sources**
- [components/if.ts](file://src/components/if.ts#L15-L27)

### Suspense
The `Suspense` component handles loading states for async operations.

**Signature:**
```typescript
const Suspense = ({ when, fallback, children }: { 
  when?: FunctionMaybe<unknown>, 
  fallback?: Child, 
  children?: Child 
}): ObservableReadonly<Child>
```

**Parameters:**
- `when`: Condition to determine if suspense should be active
- `fallback`: Content to display while suspended
- `children`: Content to display when not suspended

**Behavior:**
- Uses `SuspenseContext` for context management
- Wraps content in a suspense boundary
- Uses `useSuspense` to manage the suspense state
- Delegates to `ternary` for conditional rendering

**Section sources**
- [components/suspense.ts](file://src/components/suspense.ts#L15-L25)

## Hooks API

### useContext
The `useContext` hook provides access to context values within functional components.

**Signature:**
```typescript
function useContext<T>(Context: ContextWithDefault<T>): T
function useContext<T>(Context: Context<T>): T | undefined
function useContext<T>(Context: ContextWithDefault<T> | Context<T>): T | undefined
```

**Parameters:**
- `Context`: The context object created by `createContext`

**Returns:**
- The current context value

**Behavior:**
- First tries to get context from webComponentMap (for custom elements)
- Falls back to Soby's context system (for JSX components)
- Returns the defaultValue if no provider is found
- Returns undefined if no provider is found and no defaultValue was provided

**Section sources**
- [hooks/use_context.ts](file://src/hooks/use_context.ts#L45-L78)

### Other Hooks
The hooks API includes various utility hooks for common patterns:

- `useAbortController`: Creates an AbortController for request cancellation
- `useAbortSignal`: Gets an abort signal from an AbortController
- `useAnimationFrame`: Runs a function on the next animation frame
- `useAnimationLoop`: Runs a function on every animation frame
- `useAttached`: Tracks when an element is attached to the DOM
- `useContext`: Accesses context values (documented above)
- `useEventListener`: Adds event listeners with proper cleanup
- `useFetch`: Performs HTTP requests with reactive handling
- `useIdleCallback`: Runs a function during browser idle periods
- `useIdleLoop`: Runs a function on every idle callback
- `useInterval`: Runs a function at regular intervals
- `useMicrotask`: Runs a function on the next microtask
- `useMounted`: Tracks whether a component is mounted
- `useMountedContext`: Gets the mounted context
- `usePromise`: Handles promises with reactive updates
- `useResolved`: Resolves values reactively
- `useResource`: Manages resource loading states
- `useTimeout`: Runs a function after a delay

**Section sources**
- [hooks/index.ts](file://src/hooks/index.ts#L1-L18)

## Type Definitions

### Component
The `Component` type represents a Woby component, which can be a function, intrinsic element, or DOM node.

**Definition:**
```typescript
type Component<P = {}> = ComponentFunction<P> | ComponentIntrinsicElement | ComponentNode
```

**Variants:**
- `ComponentFunction<P>`: A function that takes props and returns a Child
- `ComponentIntrinsicElement`: A string representing an HTML/SVG element
- `ComponentNode`: A DOM node

**Section sources**
- [types.ts](file://src/types.ts#L27-L27)

### Child
The `Child` type represents any valid child content in Woby.

**Definition:**
```typescript
type Child = null | undefined | boolean | bigint | number | string | symbol | Node | Array<Child> | (() => Child)
```

**Variants:**
- Primitive values (null, undefined, boolean, etc.)
- DOM nodes
- Arrays of children
- Functions that return children (for reactivity)

**Section sources**
- [types.ts](file://src/types.ts#L15-L15)

### Props
The `Props` type represents component properties.

**Definition:**
```typescript
type Props = Record<string, any>
```

**Usage:**
- Used as the generic parameter for component functions
- Allows any key-value pairs
- Extended by specific component interfaces

**Section sources**
- [types.ts](file://src/types.ts#L115-L115)

## Practical Examples

### Basic Component Usage
```typescript
import { h, render } from 'woby'

// Create a simple component
const HelloWorld = () => h('div', null, 'Hello, World!')

// Render it to the DOM
render(HelloWorld(), document.getElementById('app'))
```

### Conditional Rendering
```typescript
import { $, If } from 'woby'

const ToggleComponent = () => {
  const isVisible = $(true)
  
  return (
    <div>
      <If when={isVisible} fallback={<div>Hidden</div>}>
        <div>Visible!</div>
      </If>
      <button onClick={() => isVisible(!isVisible())}>
        Toggle
      </button>
    </div>
  )
}
```

### List Rendering
```typescript
import { $, For } from 'woby'

const ListComponent = () => {
  const items = $(['Apple', 'Banana', 'Cherry'])
  
  return (
    <ul>
      <For values={items}>
        {(item, index) => <li key={index()}>{item}</li>}
      </For>
    </ul>
  )
}
```

### Custom Element
```typescript
import { $, defaults, customElement } from 'woby'

// Define component with defaults
const Counter = defaults(() => ({
  value: $(0, { type: 'number' } as const),
  label: $('Counter')
}), ({ value, label }) => (
  <div>
    <h3>{label}</h3>
    <p>Count: {value}</p>
    <button onClick={() => value($$(value) + 1)}>+</button>
  </div>
))

// Register as custom element
customElement('my-counter', Counter)

// Use in HTML
// <my-counter value="5" label="My Counter"></my-counter>
```

### Context Usage
```typescript
import { createContext, useContext } from 'woby'

// Create a context
const ThemeContext = createContext('light')

// Use in a component
const ThemedButton = () => {
  const theme = useContext(ThemeContext)
  return <button className={`theme-${theme}`}>Click me</button>
}

// Provide a value
const App = () => (
  <ThemeContext.Provider value="dark">
    <ThemedButton />
  </ThemeContext.Provider>
)
```

## Versioning and Compatibility

### Versioning Policy
Woby follows semantic versioning (semver) for its releases:

- **Major versions** (X.0.0): Include breaking changes
- **Minor versions** (0.X.0): Include new features and non-breaking changes
- **Patch versions** (0.0.X): Include bug fixes and performance improvements

### Deprecation Policy
When features are deprecated:

1. They are marked as deprecated in documentation
2. A deprecation warning is logged when used
3. They remain functional for at least two minor versions
4. They are removed in the next major version

### Backward Compatibility
Woby maintains backward compatibility through:

- Careful API design that anticipates future needs
- Non-breaking additions to existing APIs
- Migration utilities for breaking changes
- Comprehensive test coverage

### Migration Guide
When upgrading between major versions:

1. Review the changelog for breaking changes
2. Update imports and usage patterns as needed
3. Use deprecation warnings to identify affected code
4. Test thoroughly to ensure functionality

## Conclusion
This API reference provides comprehensive documentation for Woby's public interfaces. The core methods, components, hooks, and type definitions covered in this document form the foundation of the Woby framework, enabling developers to build reactive web applications with ease.

The framework's design emphasizes simplicity, reactivity, and interoperability, making it suitable for a wide range of applications from small components to complex SPAs. By following the patterns and best practices outlined in this documentation, developers can create efficient, maintainable, and scalable applications.

For the latest updates and additional resources, refer to the official Woby documentation and community forums.