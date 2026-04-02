# Context API Usage Comparison - Before vs After v2.0.32

This document shows the differences in Context API usage before and after the v2.0.32 updates.

## Table of Contents

1. [Basic Provider Usage](#basic-provider-usage)
2. [Visible Provider for Debugging](#visible-provider-for-debugging)
3. [Static vs Observable Context](#static-vs-observable-context)
4. [Multiple Siblings Pattern](#multiple-siblings-pattern)
5. [Nested Providers](#nested-providers)
6. [Custom Element Usage](#custom-element-usage)

---

## Basic Provider Usage

### Before v2.0.32

```tsx
import { createContext, useContext } from 'woby'

const ThemeContext = createContext('light')

const App = () => (
  <ThemeContext.Provider value="dark">
    <Toolbar />
  </ThemeContext.Provider>
)

// Provider always rendered as <context-provider> DOM node
// Output: <context-provider value="dark"><Toolbar /></context-provider>
```

### After v2.0.32

```tsx
import { createContext, useContext } from 'woby'

const ThemeContext = createContext('light')

const App = () => (
  // Default behavior: invisible provider (React-like)
  <ThemeContext.Provider value="dark">
    <Toolbar />
  </ThemeContext.Provider>
)

// Output: <Toolbar /> (no wrapper DOM node)
// Context still propagated to children
```

### Key Change
- **Before**: Provider always rendered as DOM node
- **After**: Provider is invisible by default (like React)
- **Migration**: Add `visible={true}` if you need the DOM node

---

## Visible Provider for Debugging

### Before v2.0.32

```tsx
// No way to control visibility
// Always visible, couldn't opt-out
<ThemeContext.Provider value="dark">
  <Toolbar />
</ThemeContext.Provider>
// Always renders: <context-provider value="dark">...</context-provider>
```

### After v2.0.32

```tsx
// Explicitly make provider visible for debugging
<ThemeContext.Provider value="dark" visible={true}>
  <Toolbar />
</ThemeContext.Provider>
// Renders: <context-provider value="dark"><Toolbar /></context-provider>

// Production: invisible provider (default)
<ThemeContext.Provider value="dark">
  <Toolbar />
</ThemeContext.Provider>
// Renders: <Toolbar /> (no wrapper)
```

### Key Change
- **New Feature**: `visible` prop added
- **Default**: `false` (invisible, React-like)
- **Explicit**: Set `visible={true}` to render DOM node
- **Use Case**: Debugging, CSS targeting, layout control

---

## Static vs Observable Context

### Before v2.0.32

```tsx
import { $, createContext, useContext } from 'woby'

const ConfigContext = createContext({})

// All context values treated as observables by default
// No way to opt-out of reactivity
const App = () => {
  const config = { theme: 'dark', lang: 'en' }
  
  return (
    <ConfigContext.Provider value={config}>
      <Settings />
    </ConfigContext.Provider>
  )
}

// Even static values tracked as observables (performance overhead)
```

### After v2.0.32

```tsx
import { $, createContext, useContext } from 'woby'

const ConfigContext = createContext({})

// Static context value (non-reactive, better performance)
const App = () => {
  const config = { theme: 'dark', lang: 'en' }
  
  return (
    <ConfigContext.Provider value={config} isStatic={true}>
      <Settings />
    </ConfigContext.Provider>
  )
}

// Observable context value (reactive, when needed)
const CounterApp = () => {
  const count = $(0)
  
  return (
    <ConfigContext.Provider value={count} isStatic={false}>
      <CounterDisplay />
    </ConfigContext.Provider>
  )
}
```

### Key Change
- **New Feature**: `isStatic` prop controls reactivity
- **Default**: `false` (observable, reactive)
- **Optimization**: Set `isStatic={true}` for non-reactive values
- **Performance**: Reduces observable tracking overhead

---

## Multiple Siblings Pattern

### Before v2.0.32

```tsx
import { createContext, useContext } from 'woby'

const UserContext = createContext('anonymous')

// Had to wrap each sibling individually or use nested providers
const App = () => (
  <>
    <UserContext.Provider value="user1">
      <Sibling1 />
    </UserContext.Provider>
    <UserContext.Provider value="user1">
      <Sibling2 />
    </UserContext.Provider>
    <UserContext.Provider value="user1">
      <Sibling3 />
    </UserContext.Provider>
  </>
)

// Or all share same context but verbose
```

### After v2.0.32

```tsx
import { createContext, useContext } from 'woby'

const UserContext = createContext('anonymous')

// Define sibling components
const Sibling1 = () => <p>First: {useContext(UserContext)}</p>
const Sibling2 = () => <p>Second: {useContext(UserContext)}</p>
const Sibling3 = () => <p>Third: {useContext(UserContext)}</p>

// Single provider wraps all siblings - clean and simple
const App = () => (
  <UserContext.Provider value="multi-test">
    <Sibling1 />
    <Sibling2 />
    <Sibling3 />
  </UserContext.Provider>
)

// All siblings access "multi-test" value
// Clean, efficient, no repetition
```

### Key Change
- **Improved**: Better documentation of multiple siblings pattern
- **Clarified**: Single provider can wrap multiple children
- **Pattern**: Define components outside, consume context inside

---

## Nested Providers

### Before v2.0.32

```tsx
import { createContext, useContext } from 'woby'

const ThemeContext = createContext('default')

// Nested providers worked but behavior wasn't well documented
const App = () => (
  <ThemeContext.Provider value="outer">
    <Child1 />
    <ThemeContext.Provider value="inner">
      <Child2 />
      <Child3 />
    </ThemeContext.Provider>
    <Child4 />
  </ThemeContext.Provider>
)

// Child1: "outer"
// Child2: "inner"
// Child3: "inner"
// Child4: "outer"
// But this wasn't clearly explained
```

### After v2.0.32

```tsx
import { createContext, useContext } from 'woby'

const ThemeContext = createContext('default')

const Child1 = () => <p>{useContext(ThemeContext)} {/* "outer" */}</p>
const Child2 = () => <p>{useContext(ThemeContext)} {/* "inner" */}</p>
const Child3 = () => <p>{useContext(ThemeContext)} {/* "inner" */}</p>
const Child4 = () => <p>{useContext(ThemeContext)} {/* "outer" */}</p>

// Position-based context resolution clearly documented
const App = () => (
  <ThemeContext.Provider value="outer">
    <Child1 /> {/* Gets "outer" */}
    
    {/* Override context for nested children */}
    <ThemeContext.Provider value="inner">
      <Child2 /> {/* Gets "inner" */}
      <Child3 /> {/* Gets "inner" */}
    </ThemeContext.Provider>
    
    <Child4 /> {/* Back to "outer" */}
  </ThemeContext.Provider>
)
```

### Key Change
- **Clarified**: Position-based context resolution documented
- **Explained**: How nested providers override parent context
- **Examples**: Complete working examples with expected values

---

## Custom Element Usage

### Before v2.0.32

```tsx
import { createContext, useContext, customElement, defaults } from 'woby'

const ThemeContext = createContext('light')

const ThemedElement = defaults(() => ({}), () => {
  const theme = useContext(ThemeContext)
  return <div>Theme: {theme}</div>
})

customElement('themed-element', ThemedElement)

// Usage in HTML:
// <theme-context-provider value="dark">
//   <themed-element></themed-element>
// </theme-context-provider>
// 
// Behavior unclear - JSX vs custom element differences not documented
```

### After v2.0.32

```tsx
import { createContext, useContext, customElement, defaults } from 'woby'

const ThemeContext = createContext('light')

// Works in custom elements
const ThemedElement = defaults(() => ({}), () => {
  const theme = useContext(ThemeContext)
  return <div>Theme: {theme}</div>
})

customElement('themed-element', ThemedElement)

// Usage in HTML (always renders as DOM node):
// <theme-context-provider value="dark">
//   <themed-element></themed-element>
// </theme-context-provider>

// Usage in JSX (invisible by default):
const App = () => (
  <ThemeContext.Provider value="dark">
    <ThemedElement />
  </ThemeContext.Provider>
)

// Clear documentation of behavior differences
```

### Provider Behavior Comparison

| Usage Pattern | Renders DOM Node? | Example |
|--------------|------------------|---------|
| **JSX (default)** | ❌ No | `<Context.Provider value={v}><Child /></Context.Provider>` |
| **JSX (visible)** | ✅ Yes | `<Context.Provider value={v} visible={true}><Child /></Context.Provider>` |
| **Custom Element** | ✅ Yes | `<context-provider value="v"><child-element /></context-provider>` |

### Key Change
- **Clarified**: Different behavior for JSX vs custom elements
- **Documented**: When providers render DOM nodes
- **Controlled**: `visible` prop gives explicit control in JSX

---

## Component Function as Children

### Before v2.0.32

```tsx
import { jsx, createContext, useContext } from 'woby'

const Context = createContext('')

// Pattern existed but wasn't well documented
const App = () => {
  return (
    <>
      {() => jsx(Context.Provider, {
        value: "test",
        children: () => <p>{useContext(Context)}</p>
      })}
    </>
  )
}
```

### After v2.0.32

```tsx
import { jsx, createContext, useContext } from 'woby'

const Context = createContext('')

// Define component function separately (cleaner)
const FnProviderChild = () => {
  const ctxValue = useContext(Context)
  return <p>Component function provider: {ctxValue}</p>
}

// Use with explicit jsx() call
const App = () => (
  <>
    <h3>Context.Provider(value, () => ) Test</h3>
    {() => jsx(Context.Provider, {
      value: "component-function-value",
      children: FnProviderChild
    })}
    {/* Output: <p>Component function provider: component-function-value</p> */}
  </>
)
```

### Key Change
- **Documented**: Programmatic provider creation pattern
- **Examples**: Clear working example with expected output
- **Pattern**: Separate component definition for clarity

---

## Server-Side Rendering (SSR)

### Before v2.0.32

```tsx
import { renderToString, createContext, useContext } from 'woby'

const ThemeContext = createContext('light')

const ServerComponent = () => {
  const theme = useContext(ThemeContext)
  return <div class={`theme-${theme}`}>Server rendered</div>
}

const App = () => (
  <ThemeContext.Provider value="dark">
    <ServerComponent />
  </ThemeContext.Provider>
)

const html = renderToString(<App />)
// Worked but SSR behavior not well documented
```

### After v2.0.32

```tsx
import { renderToString, createContext, useContext } from 'woby'

const ThemeContext = createContext('light')

const ServerComponent = () => {
  const theme = useContext(ThemeContext)
  return <div class={`theme-${theme}`}>Server rendered</div>
}

const App = () => (
  <ThemeContext.Provider value="dark">
    <ServerComponent />
  </ThemeContext.Provider>
)

// SSR test pattern documented
const ssrResult = renderToString(<App />)
const expectedFull = '<div class="theme-dark">Server rendered</div>'

// Verify SSR output matches expected
console.assert(ssrResult === expectedFull, 'SSR mismatch')
```

### Key Change
- **Documented**: SSR patterns and testing
- **Verified**: Context works seamlessly with renderToString
- **Tested**: Clear assertion patterns for SSR validation

---

## Summary of Changes

| Feature | Before v2.0.32 | After v2.0.32 |
|---------|---------------|---------------|
| **Provider Visibility** | Always visible | Invisible by default, `visible={true}` to show |
| **Static Values** | All values observable | `isStatic={true}` for non-reactive |
| **Multiple Siblings** | Worked but unclear | Well-documented pattern |
| **Nested Providers** | Worked but unclear | Position-based resolution explained |
| **Custom Elements** | Behavior unclear | JSX vs CE differences clear |
| **Documentation** | Scattered examples | Comprehensive guides |
| **Examples** | Limited | Extensive with expected outputs |
| **Testing** | Not covered | Client & SSR patterns included |

---

## Migration Checklist

### Do I need to update my code?

**✅ NO** - If you're using:
- Standard context with invisible providers (your code continues to work)
- Observable context values (default behavior unchanged)
- Single provider wrapping single child

**⚠️ YES** - If you're using:
- Providers expecting them to render as DOM nodes
  - **Solution**: Add `visible={true}` prop explicitly
  
- Static values being tracked as observables (performance concern)
  - **Solution**: Add `isStatic={true}` for non-reactive values

### Quick Migration Guide

```diff
// If you rely on provider rendering as DOM node:
- <ThemeContext.Provider value="dark">
+ <ThemeContext.Provider value="dark" visible={true}>
    <Child />
  </ThemeContext.Provider>

// If you have static values (performance optimization):
- <ConfigContext.Provider value={staticConfig}>
+ <ConfigContext.Provider value={staticConfig} isStatic={true}>
    <Child />
  </ConfigContext.Provider>
```

---

## Benefits of Changes

### Performance
- ✅ Reduced DOM nodes (invisible providers by default)
- ✅ Optional observable tracking (`isStatic` prop)
- ✅ Fine-grained control over reactivity

### Developer Experience
- ✅ React-like behavior (easier migration from React)
- ✅ Explicit control via props
- ✅ Better debugging with visible option
- ✅ Clear documentation and examples

### Flexibility
- ✅ Choose invisible or visible per use case
- ✅ Choose reactive or static per value
- ✅ Works seamlessly with JSX and custom elements
- ✅ Backwards compatible for most users

---

**Version**: 2.0.32  
**Status**: ✅ Complete  
**Backwards Compatible**: Yes (with optional migration for specific use cases)
