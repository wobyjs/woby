# Getting Started

<cite>
**Referenced Files in This Document**   
- [readme.md](file://readme.md)
- [package.json](file://package.json)
- [src/index.ts](file://src/index.ts)
- [src/methods/render.ts](file://src/methods/render.ts)
- [src/methods/create_element.ts](file://src/methods/create_element.ts)
- [src/hooks/use_context.ts](file://src/hooks/use_context.ts)
- [src/methods/create_context.tsx](file://src/methods/create_context.tsx)
- [src/via/README.md](file://src/via/README.md)
- [src/via/index.html](file://src/via/index.html)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Installation Methods](#installation-methods)
3. [Project Setup](#project-setup)
4. [Hello World Application](#hello-world-application)
5. [Reactive Features Setup](#reactive-features-setup)
6. [Configuration Options](#configuration-options)
7. [Entry Points and Initialization](#entry-points-and-initialization)
8. [Common Setup Issues](#common-setup-issues)
9. [Conclusion](#conclusion)

## Introduction
Woby is a high-performance framework with fine-grained observable-based reactivity designed for building rich applications. Built upon the Soby reactive core, Woby provides an enhanced API for component-based development without requiring Babel transforms. This guide provides comprehensive instructions for setting up Woby, creating your first application, and understanding the initialization process.

**Section sources**
- [readme.md](file://readme.md)

## Installation Methods
Woby can be installed through various package managers. The framework is published on npm with multiple entry points for different use cases.

Using npm:
```bash
npm install woby
```

Using pnpm:
```bash
pnpm add woby
```

Using yarn:
```bash
yarn add woby
```

The package.json file defines multiple export conditions including standard, SSR, testing, and via.js integration, allowing developers to import specific modules based on their needs:
- `"."` - Main entry point for standard usage
- `"./via"` - Integration with via.js for Web Workers
- `"./ssr"` - Server-side rendering capabilities
- `"./testing"` - Testing utilities
- `"./jsx-runtime"` - JSX runtime support

**Section sources**
- [package.json](file://package.json)

## Project Setup
Woby can be integrated into projects with or without build tools. For projects without build tools, Woby provides UMD bundles that can be included directly in HTML files.

### Without Build Tools
Include Woby directly in your HTML file using the browser-compatible UMD build:

```html
<script src="https://unpkg.com/woby/dist/index.umd.js"></script>
```

### With Bundlers
When using bundlers like Vite, Webpack, or Rollup, import Woby modules directly:

```typescript
import { $, render } from 'woby'
```

The framework supports various module formats (ESM, CJS) and is optimized for tree-shaking, ensuring only used functions are included in the final bundle.

### Via.js Integration
For Web Worker integration, Woby provides special support through via.js, allowing DOM access from workers:

```javascript
const document = via.document;
const button = document.createElement("button");
button.textContent = "Click me";
document.body.appendChild(button);
```

This enables rich UI development within Web Workers while maintaining the same API as the main thread.

**Section sources**
- [package.json](file://package.json)
- [src/via/README.md](file://src/via/README.md)
- [src/via/index.html](file://src/via/index.html)

## Hello World Application
Creating a simple "Hello World" application with Woby involves setting up the basic structure and using the render function to mount the application.

### Basic Setup
```typescript
import { render } from 'woby'

const App = () => {
  return <h1>Hello World</h1>
}

render(<App />, document.getElementById('app'))
```

### Complete Example
A more comprehensive example demonstrates the basic structure:

```typescript
import { $, render } from 'woby'

const Counter = () => {
  const count = $(0)
  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={() => count(prev => prev + 1)}>
        Increment
      </button>
    </div>
  )
}

render(<Counter />, document.getElementById('app'))
```

This example shows the core reactive pattern: creating an observable with `$()`, using it directly in JSX, and updating it with a function.

**Section sources**
- [src/index.ts](file://src/index.ts)
- [src/methods/render.ts](file://src/methods/render.ts)

## Reactive Features Setup
Woby's reactive system is based on fine-grained observables that automatically track dependencies and update the DOM efficiently.

### Creating Observables
The `$()` function creates observables that represent reactive state:

```typescript
const count = $(0)           // Observable with initial value
const name = $('John')       // String observable
const isActive = $(true)     // Boolean observable
```

### Reading and Writing
Observables can be read by calling them without arguments and written by calling them with a value:

```typescript
// Reading
console.log(count())         // Get current value

// Writing
count(5)                     // Set to 5
count(prev => prev + 1)      // Update based on previous value
```

### Automatic Dependency Tracking
Woby automatically tracks dependencies when observables are accessed within effects or computations:

```typescript
useEffect(() => {
  console.log(`Count changed to: ${count()}`)
})
```

The effect will automatically re-run whenever `count` changes, without requiring dependency arrays.

**Section sources**
- [src/index.ts](file://src/index.ts)
- [src/methods/render.ts](file://src/methods/render.ts)

## Configuration Options
Woby provides various configuration options for different environments and bundling scenarios.

### Environment-Specific Builds
The package exports different entry points for various environments:
- Standard browser applications: `import 'woby'`
- Server-side rendering: `import 'woby/ssr'`
- Testing environments: `import 'woby/testing'`
- Web Workers with via.js: `import 'woby/via'`

### JSX Configuration
Woby supports JSX without requiring Babel transforms by using the standard JSX runtime:

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "woby"
  }
}
```

This configuration allows using JSX syntax while compiling to Woby's createElement function.

### Bundler Configuration
For optimal tree-shaking, configure your bundler to respect the package's sideEffects flag, which is set to false in package.json, indicating all exports are side-effect free and can be safely tree-shaken.

**Section sources**
- [package.json](file://package.json)
- [src/index.ts](file://src/index.ts)

## Entry Points and Initialization
Understanding Woby's entry points is crucial for proper application initialization.

### The render Function
The primary entry point for mounting applications is the `render` function, which takes a component and a DOM element:

```typescript
export const render = (child: Child, parent?: Element | null | ShadowRoot): Disposer => {
    if (!parent || !(parent instanceof HTMLElement || parent instanceof ShadowRoot)) 
        throw new Error('Invalid parent node')

    parent.textContent = ''
    
    return useRoot((stack, dispose) => {
        setChild(parent, child, FragmentUtils.make(), stack)
        
        return (): void => {
            dispose(stack)
            parent.textContent = ''
        }
    })
}
```

The function clears the parent element, mounts the component, and returns a disposer function to clean up the component when unmounted.

### The index.ts Entry
The main entry point (src/index.ts) exports all core functionality, organizing exports from various modules:

```typescript
export * from './singleton'
export * from './components'
export * from './jsx/runtime'
export * from './hooks'
// Explicitly export from methods and utils
export {
    $,
    $$,
    batch,
    context,
    createContext,
    createDirective,
    createElement,
    // ... other exports
} from './methods'
```

This structure provides a clean API surface while organizing implementation details in separate modules.

### Context Initialization
The createContext and useContext functions enable passing data through the component tree:

```typescript
const ThemeContext = createContext('light')
const theme = useContext(ThemeContext)
```

This pattern avoids prop drilling and enables theme management, user authentication state, and other global data sharing.

**Diagram sources**
- [src/methods/render.ts](file://src/methods/render.ts#L8-L29)
- [src/index.ts](file://src/index.ts#L0-L111)
- [src/hooks/use_context.ts](file://src/hooks/use_context.ts#L0-L39)
- [src/methods/create_context.tsx](file://src/methods/create_context.tsx#L36-L72)

**Section sources**
- [src/methods/render.ts](file://src/methods/render.ts)
- [src/index.ts](file://src/index.ts)
- [src/hooks/use_context.ts](file://src/hooks/use_context.ts)
- [src/methods/create_context.tsx](file://src/methods/create_context.tsx)

## Common Setup Issues
Several common issues may arise during Woby setup, along with their solutions.

### Invalid Parent Node Error
When calling render, ensure the parent element exists and is a valid HTMLElement or ShadowRoot:

```typescript
// ❌ This will fail if element doesn't exist
render(<App />, document.getElementById('nonexistent'))

// ✅ Check element existence
const app = document.getElementById('app')
if (app) {
    render(<App />, app)
}
```

### JSX Not Compiling
Ensure proper TypeScript configuration for JSX:

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "woby",
    "allowJs": true
  }
}
```

### Observable Not Updating
Ensure you're calling the observable to read its value in reactive contexts:

```typescript
// ❌ This won't update automatically
<div>{count}</div>

// ✅ This will update automatically
<div>{() => count()}</div>

// ✅ Or pass observable directly (preferred)
<div>{count}</div>
```

### Circular Dependencies
When organizing code, avoid circular imports between components and utilities. Use barrel files (index.ts) to manage exports and prevent circular references.

### Web Worker Limitations
When using via.js integration, remember that DOM access is proxied, which may have performance implications for high-frequency updates.

**Section sources**
- [src/methods/render.ts](file://src/methods/render.ts)
- [readme.md](file://readme.md)

## Conclusion
Woby provides a powerful reactive framework with a simple setup process. By understanding the installation methods, project configuration options, and initialization patterns, developers can quickly start building reactive applications. The framework's design eliminates common React patterns like dependency arrays and keys while providing fine-grained reactivity through observables. With support for various environments and bundlers, Woby offers flexibility for different project requirements while maintaining high performance through direct DOM manipulation.