# SSR Upgrading Documentation

## Environment Detection and Switching with `getEnv`

The `getEnv` function is the core mechanism for seamless cross-environment operation in the Woby framework.

### Function Overview

```typescript
export function getEnv(type?: Env)
```

Where `Env` can be: `'ssr' | 'browser' | 'via'`

### Core Logic

#### 1. Environment Auto-Detection
```typescript
const detectedType = type ?? (typeof window === 'undefined' ? 'ssr' : 'browser');
```
- **No `window`** = SSR environment (Node.js)
- **`window` exists** = Browser environment
- **Explicit type parameter** overrides auto-detection

#### 2. Environment Return Objects

**SSR Environment (`getEnv('ssr')` or auto-detected):**
```typescript
return {
    document: doc,                    // Custom SSR document mock
    customElements,                  // Custom SSR custom elements mock
    MutationObserver,                // Custom SSR mutation observer
    customElement,                   // Custom SSR custom element implementation
    isSSR: true,
    ...getCreators('ssr')            // SSR-specific node creators
}
```

**Browser Environment (auto-detected):**
```typescript
return {
    document: globalThis.document,    // Native browser document
    customElements: globalThis.customElements,
    MutationObserver: globalThis.MutationObserver,
    customElement: globalThis.customElement,
    isSSR: false,
    ...getCreators('browser')        // Browser-specific node creators
}
```

**Via.js Environment (special case):**
```typescript
if (typeof via !== 'undefined' && type === 'via') {
    const document = via.document    // Via.js proxied document
    // ... via-specific creators
}
```

### Usage Patterns

#### 1. Auto-Detection (Recommended)
```typescript
// Automatically detects environment
const env = getEnv();

// Works identically in SSR and browser
const element = env.createHTMLNode('div');
const text = env.createText('Hello World');
element.appendChild(text);
```

#### 2. Explicit SSR Mode
```typescript
// Force SSR mode even in browser
const ssrEnv = getEnv('ssr');
const htmlString = renderToString(<App />); // Uses SSR creators
```

#### 3. Dual Mode in Browser
```typescript
// Browser environment with SSR capability
const browserEnv = getEnv();        // Auto-detects 'browser'
const ssrEnv = getEnv('ssr');       // Explicit SSR mode

// Use browser DOM for interactive components
const interactiveElement = browserEnv.createHTMLNode('button');

// Use SSR for static rendering/pre-rendering
const staticHTML = ssrEnv.createHTMLNode('div'); // SSR mock
```

### Key Benefits

1. **Zero Configuration** - Auto-detects environment without explicit setup
2. **Seamless Switching** - Same API works identically across environments
3. **Performance Optimized** - Direct native calls in browser, mock objects in SSR
4. **Type Safety** - Full TypeScript support with proper return types
5. **Fallback Handling** - Graceful degradation when environment detection fails

### Migration from HappyDOM

#### Before (HappyDOM-based SSR):
```typescript
// src/utils/creators.ssr.ts
import { Window } from 'happy-dom'
const window = new Window()
const document = window.document

export const createHTMLNode = document.createElement.bind(document)
```

#### After (Custom Mock-based SSR):
```typescript
// src/utils/creators.ts
import { document as doc } from '../ssr/document'
import { customElements } from '../ssr/custom_elements'
import { MutationObserver } from '../ssr/mutation_observer'
import { customElement } from '../ssr/custom_element'

export function getEnv(type?: Env) {
    const detectedType = type ?? (typeof window === 'undefined' ? 'ssr' : 'browser')
    const isSSR = detectedType === 'ssr'
    
    if (isSSR) {
        return {
            document: doc,
            customElements,
            MutationObserver,
            customElement,
            isSSR: true,
            ...getCreators('ssr')
        }
    } else {
        return {
            document: globalThis.document,
            customElements: globalThis.customElements,
            MutationObserver: globalThis.MutationObserver,
            customElement: globalThis.customElement,
            isSSR: false,
            ...getCreators('browser')
        }
    }
}
```

### Testing Strategy

#### SSR Testing (`getEnv('ssr')`):
```typescript
// Test SSR rendering
const ssrEnv = getEnv('ssr')
const result = renderToString(<Component />);
expect(result).toContain('expected HTML');
```

#### Browser Testing (auto-detected):
```typescript
// Test browser behavior
const browserEnv = getEnv() // Auto-detects browser in test environment
const element = browserEnv.createHTMLNode('div')
document.body.appendChild(element)
```

#### Dual Environment Testing:
```typescript
// Test both environments
test('works in both environments', () => {
    // SSR mode
    const ssrResult = renderToString(<Component />);
    
    // Browser mode
    const browserEnv = getEnv();
    const element = browserEnv.createHTMLNode('div');
    
    // Both should produce equivalent results
    expect(stripWhitespace(ssrResult)).toEqual(stripWhitespace(element.outerHTML));
});
```

### Performance Considerations

#### SSR Mode Benefits:
- No external dependencies (removed HappyDOM)
- Faster startup time
- Better memory usage
- Eliminates runtime compatibility issues

#### Browser Mode Benefits:
- Native DOM performance
- Full browser API access
- No mock overhead
- Direct event handling

### Common Patterns

#### 1. Conditional Rendering:
```typescript
function MyComponent() {
    const env = getEnv();
    
    if (env.isSSR) {
        // SSR-specific optimizations
        return <StaticContent />;
    } else {
        // Browser-specific interactivity
        return <InteractiveComponent />;
    }
}
```

#### 2. Environment-Specific Logic:
```typescript
function getData() {
    const env = getEnv();
    
    if (env.isSSR) {
        // Server-side data fetching
        return fetchDataFromAPI();
    } else {
        // Client-side data fetching
        return fetch('/api/data');
    }
}
```

#### 3. Hybrid Components:
```typescript
function HybridComponent() {
    // Use browser environment for interactive elements
    const browserEnv = getEnv();
    const interactiveElement = browserEnv.createHTMLNode('button');
    
    // Use SSR environment for static content
    const ssrEnv = getEnv('ssr');
    const staticContent = renderToString(<StaticMarkup />);
    
    return (
        <div>
            <div dangerouslySetInnerHTML={{ __html: staticContent }} />
            {interactiveElement}
        </div>
    );
}
```

### Troubleshooting

#### Common Issues:

1. **Environment Detection Failures:**
   ```typescript
   // Explicitly specify environment when auto-detection fails
   const env = getEnv('ssr'); // Force SSR mode
   ```

2. **Missing Mock Implementations:**
   ```typescript
   // Ensure all required SSR mocks are imported
   import { document, customElements, MutationObserver, customElement } from '../ssr/'
   ```

3. **Type Mismatches:**
   ```typescript
   // Use proper typing for environment objects
   const env: ReturnType<typeof getEnv> = getEnv();
   ```

#### Debugging Tips:

1. Check `env.isSSR` to verify current environment
2. Use `console.log(getEnv())` to inspect available methods
3. Test both environments explicitly during development
4. Validate mock implementations match browser API signatures

### Future Enhancements

#### Planned Features:
- Environment-specific performance optimizations
- Enhanced mock fidelity for complex DOM operations
- Better TypeScript integration with environment-specific types
- Runtime environment switching capabilities
- Enhanced debugging tools for environment issues

## Environment Context Passing Implementation

### Current Execution Path Issues

The current SSR implementation has a fundamental flaw in environment context passing:

**Current Flow:**
```
JSX() → createElement() → createHTMLNode/createSVGNode (hardcoded)
render() & renderToString() both → same createElement
```

**Problem:** No way to differentiate between browser and SSR execution contexts when both are available.

### Proposed Solution: Contextual Environment Passing

#### 1. Environment Context Setup
```typescript
// Create a context for environment passing
const EnvironmentContext = createContext<'ssr' | 'browser' | 'via'>('browser')

// Hook to access current environment
function useEnvironment() {
    return useContext(EnvironmentContext)
}

// Environment-aware creators
function getEnvironmentAwareCreators(env?: 'ssr' | 'browser' | 'via') {
    const currentEnv = env || useEnvironment() || 'browser'
    
    return getEnv(currentEnv)
}
```

#### 2. Modified JSX Runtime
```typescript
// jsx-runtime.ssr.tsx
function jsx<P>(component: Component<P>, props?: P, ...children: Child[]): Element {
    const env = useEnvironment() || 'browser'
    const creators = getEnvironmentAwareCreators(env)
    
    // Pass creators to createElement
    return wrapCloneElement(
        createElementWithEnv<P>(component as any, props ?? {} as P, children, creators), 
        component, 
        props
    )
}
```

#### 3. Environment-Aware CreateElement
```typescript
// create_element.ssr.ts
const createElementWithEnv = <P = { children?: Child }>(
    component: Component<P>, 
    _props?: P | null, 
    _children: Child[],
    creators: typeof getSSRCreators | typeof getBrowserCreators
) => {
    // Use passed creators instead of hardcoded imports
    const { createHTMLNode, createSVGNode } = creators()
    
    // Rest of implementation remains the same
    // but uses the passed creators
}
```

#### 4. Render Functions with Environment Provider
```typescript
// render.ts (browser mode)
const render = (child: Child, parent?: Element | null): Disposer => {
    // Wrap in Environment Provider for browser context
    const BrowserEnvironmentWrapper = () => jsx(EnvironmentContext.Provider, {
        value: "browser",
        children: child
    })
    
    return useRoot((stack, dispose) => {
        setChild(parent, jsx(BrowserEnvironmentWrapper, {}), FragmentUtils.make(), stack)
        return () => dispose(stack)
    })
}

// render_to_string.ssr.ts (force SSR)
export const renderToString = (child: Child): string => {
    // Wrap in Environment Provider for SSR context
    const SSREnvironmentWrapper = () => jsx(EnvironmentContext.Provider, {
        value: "ssr",
        children: child
    })
    
    const container = { children: '' }
    const stack = new Error()
    const fragment = FragmentUtils.make()
    setChild(container as any, jsx(SSREnvironmentWrapper, {}), fragment, stack)
    
    // Process and return string
    const children = FragmentUtils.getChildren(fragment)
    return processChildrenToString(children)
}
```

### Benefits of Contextual Passing

1. **Explicit Environment Control:** `renderToString()` forces SSR mode even in browser
2. **Dual-Mode Capability:** Browser can use both DOM and SSR rendering
3. **Clean Separation:** No global state pollution
4. **Type Safety:** Full TypeScript support for environment contexts
5. **Backward Compatibility:** Existing code continues to work

### Implementation Steps

1. Create `EnvironmentContext` with proper context management
2. Modify `createElement` to accept creator functions
3. Update JSX runtime to pass environment context
4. Update render functions to establish environment context
5. Ensure all utility functions respect the context

This approach provides the exact behavior you requested:
- `render()` → default browser or SSR if no window
- `renderToString()` → force SSR environment
- Context flows down through the entire execution chain

This documentation provides a comprehensive guide for understanding and utilizing the new SSR environment system based on the `getEnv` abstraction mechanism.