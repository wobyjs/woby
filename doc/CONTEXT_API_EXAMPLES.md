# Context API Examples

This document provides comprehensive examples of using the Context API in Woby, demonstrating various patterns and use cases.

## Table of Contents

- [Basic Context Usage](#basic-context-usage)
- [Multiple Contexts](#multiple-contexts)
- [Nested Contexts](#nested-contexts)
- [Context in Custom Elements](#context-in-custom-elements)
- [Context with Function Children](#context-with-function-children)
- [Dynamic Context Providers](#dynamic-context-providers)
- [Context in HTML via dangerouslySetInnerHTML](#context-in-html-via-dangerouslysetinnerhtml)

## Basic Context Usage

### TSX Component Example

```tsx
import { createContext, useContext, type JSX } from 'woby'

const TestContextHook = (): JSX.Element => {
    const Context = createContext('')

    const Reader = (): JSX.Element => {
        const value = useContext(Context)
        return <p>{value}</p>
    }

    return () => (
        <>
            <h3>Context - Hook</h3>
            <Context.Provider value="outer">
                <Reader />
                <Context.Provider value="inner">
                    <Reader />
                </Context.Provider>
                <Reader />
            </Context.Provider>

            {/* Context.Provider with function children */}
            <h3>Context.Provider(value, () => ) Test</h3>
            {() => jsx(Context.Provider, {
                value: "function-value",
                children: () => {
                    const value = useContext(Context)
                    return <p>Function provider: {value}</p>
                }
            })}
        </>
    )
}
```

## Multiple Contexts

```tsx
import { createContext, useContext, type JSX } from 'woby'

const ThemeContext = createContext('light')
const UserContext = createContext({ name: 'Anonymous', id: 0 })
const AppContext = createContext('default-app')

// Custom element consuming multiple contexts
const MultiContextElement = defaults(() => ({}), () => {
    const theme = useContext(ThemeContext)
    const user = useContext(UserContext)
    const app = useContext(AppContext)
    
    return (
        <div>
            <p>Theme: {theme}</p>
            <p>User: {user.name} (ID: {user.id})</p>
            <p>App: {app}</p>
        </div>
    )
})

customElement('multi-context-element', MultiContextElement)
```

## Nested Contexts

### Deep Nesting Pattern

```tsx
const TestContextComponents = (): JSX.Element => {
    const Context = createContext('')
    
    return (
        <>
            <h3>Context - Components</h3>
            <Context.Provider value="outer">
                {() => {
                    const value = useContext(Context)
                    return <p>{value}</p>
                }}
                <Context.Provider value="inner">
                    {() => {
                        const value = useContext(Context)
                        return <p>{value}</p>
                    }}
                </Context.Provider>
                {() => {
                    const value = useContext(Context)
                    return <p>{value}</p>
                }}
            </Context.Provider>
        </>
    )
}
```

## Context in Custom Elements

### Basic Custom Element with Context

```tsx
import { $, customElement, defaults, createContext, useContext, type JSX } from 'woby'

const CounterContext = createContext(0)

const ContextConsumer = defaults(() => ({
    label: $('Consumer')
}), ({ label }) => {
    const counter = useContext(CounterContext)
    
    return (
        <div style={{
            border: '1px solid gray',
            padding: '8px',
            margin: '5px'
        }}>
            <strong>{label}:</strong>
            <ul>
                <li>Counter: {counter}</li>
            </ul>
        </div>
    )
})

customElement('context-consumer', ContextConsumer)

// Usage
const TestWrapper = () => {
    return (
        <div>
            <h1>Custom Element Context Test</h1>
            <CounterContext.Provider value={100}>
                <context-consumer label="Direct Consumer" />
            </CounterContext.Provider>
        </div>
    )
}
```

### Context Provider Custom Element

```tsx
const ContextProviderElement = defaults(() => ({
    appName: $('Default App'),
    userName: $('Default User'),
    userId: $(0, HtmlNumber),
    theme: $('light')
}), ({ appName, userName, userId, theme, children }) => {
    const userValue = { name: userName, id: userId }

    return (
        <div style={{
            border: '3px solid purple',
            padding: '20px',
            margin: '15px'
        }}>
            <h2>Context Provider: {appName}</h2>
            <AppContext.Provider value={appName}>
                <UserContext.Provider value={userValue}>
                    <ThemeContext.Provider value={theme}>
                        <div style={{ marginLeft: '20px' }}>
                            {children}
                        </div>
                    </ThemeContext.Provider>
                </UserContext.Provider>
            </AppContext.Provider>
        </div>
    )
})

customElement('context-provider-element', ContextProviderElement)
```

## Context with Function Children

```tsx
const TestContextDynamicContext = (): JSX.Element => {
    const Context = createContext('default')

    const DynamicFragment = props => {
        const ctx = useContext(Context)
        return (
            <>
                <p>{ctx}</p>
                <p>{props.children}</p>
            </>
        )
    }

    return () => (
        <>
            <h3>Dynamic - Context</h3>
            <Context.Provider value="context">
                <DynamicFragment>
                    <DynamicFragment />
                </DynamicFragment>
            </Context.Provider>

            {/* Context.Provider with function children test */}
            <h3>Context.Provider(value, () => ) Test</h3>
            {() => jsx(Context.Provider, {
                value: "dynamic-function-value",
                children: () => {
                    const ctxValue = useContext(Context)
                    return (
                        <>
                            <p>Dynamic function provider: {ctxValue}</p>
                            <p>Dynamic content: {ctxValue}</p>
                        </>
                    )
                }
            })}
        </>
    )
}
```

## Dynamic Context Providers

### Reactive Context Values

```tsx
const TestCustomElementContext = (): JSX.Element => {
    const appTheme = $('dark')
    const appCounter = $(100)
    const appNested = $('app-level')

    return () => (
        <div>
            <h1>Custom Element Context Test</h1>

            <ThemeContext.Provider value={appTheme}>
                <CounterContext.Provider value={appCounter}>
                    <NestedContext.Provider value={appNested}>
                        <h2>Direct TSX Context Usage</h2>
                        <ContextConsumer label="Direct TSX Consumer" />
                        
                        <h2>Custom Element Context Consumption</h2>
                        <context-consumer label="HTML Custom Element Consumer" />
                    </NestedContext.Provider>
                </CounterContext.Provider>
            </ThemeContext.Provider>
        </div>
    )
}
```

### Complex Nested Context Scenario

```tsx
const TestCustomElementComprehensive = () => {
    const appTitle = $('Woby Comprehensive Test')
    const user = $(123)
    const darkMode = $(false)

    return (
        <div>
            <h1>Comprehensive Custom Element Test</h1>

            {/* Context providers */}
            <AppContext.Provider value={appTitle}>
                <UserContext.Provider value={{ name: 'Test User', id: 456 }}>
                    <ThemeContext.Provider value={darkMode ? 'dark' : 'light'}>
                        {/* Basic usage */}
                        <h2>1. Basic Custom Element Usage</h2>

                        {/* TSX usage */}
                        <ComprehensiveElement
                            title="TSX Comprehensive Element"
                            count={99}
                            enabled={true}
                        >
                            <p>TSX-provided slot content</p>
                        </ComprehensiveElement>

                        {/* HTML usage */}
                        <comprehensive-element
                            title="HTML Comprehensive Element"
                            count="42"
                            enabled="false"
                        >
                            <p>HTML-provided slot content</p>
                        </comprehensive-element>

                        {/* Context provider element */}
                        <h2>2. Context Provider Element</h2>
                        <context-provider-element
                            app-name="Custom Provider App"
                            user-name="HTML User"
                            user-id="789"
                            theme="dark"
                        >
                            <comprehensive-element title="Context Consumer Element">
                                <p>Content inside context provider</p>
                            </comprehensive-element>
                        </context-provider-element>
                    </ThemeContext.Provider>
                </UserContext.Provider>
            </AppContext.Provider>
        </div>
    )
}
```

## Context in HTML via dangerouslySetInnerHTML

```tsx
import { createContext, useContext, customElement, renderToString, type JSX } from 'woby'

const readerContext = createContext<string>()
const otherContext = createContext<string>()

customElement('reader-context', readerContext.Provider)
customElement('other-context', otherContext.Provider)

const TestContextHookHtml = (): JSX.Element => {
    const Reader = defaults(() => ({}), () => {
        const ctx = useContext(readerContext)
        const oth = useContext(otherContext)

        return <p>{ctx} other: {oth}</p>
    })

    customElement('test-reader', Reader)

    // Programmatically change other-context value after mount
    useTimeout(() => {
        const otherContextEl = document.querySelector('other-context')
        if (otherContextEl) {
            otherContextEl.setAttribute('value', '456')
        }
    }, TEST_INTERVAL)

    return () => (
        <div dangerouslySetInnerHTML={{
            __html: `
            <h3>Context - Hook in HTML</h3>
                <other-context value="123">
                <reader-context value="outer">
                    <p>header</p>
                    <test-reader></test-reader>
                    <reader-context value="inner">
                        <test-reader></test-reader>
                    </reader-context>
                    <test-reader></test-reader>
                    <p>Footer</p>
                </reader-context>
            </other-context>
            `}}>
        </div>
    )
}
```

## Best Practices

### 1. Always Use useContext

```tsx
const value = useContext(MyContext)
```

### 2. Provide Default Values

```tsx
// ✅ Good: Provide a default value
const ThemeContext = createContext('light')

// ⚠️ Avoid: No default value (will be undefined if no provider)
const UserContext = createContext<User | undefined>(undefined)
```

### 3. Use Observables for Reactive Context Values

```tsx
const appTheme = $('dark')
const appCounter = $(100)

return (
    <ThemeContext.Provider value={appTheme}>
        <CounterContext.Provider value={appCounter}>
            <ChildComponent />
        </CounterContext.Provider>
    </ThemeContext.Provider>
)
```

### 4. Context Works Everywhere

The same `useContext` hook works in:
- JSX/TSX components
- Custom elements defined with `defaults()`
- HTML custom elements
- Components rendered via `dangerouslySetInnerHTML`

## Migration Guide

**Note:** The migration from `useMountedContext` to `useContext` has been completed. This section is kept for historical reference.

**Before (Deprecated):**
```tsx
const ThemedElement = defaults(() => ({}), () => {
  const [theme, mount] = useMountedContext(ThemeContext)
  return <div>{mount}Theme: {theme}</div>
})
```

**After (Recommended):**
```tsx
const ThemedElement = defaults(() => ({}), () => {
  const theme = useContext(ThemeContext)
  return <div>Theme: {theme}</div>
})
```

## See Also

- [Core Methods Documentation](./Core-Methods.md)
- [Custom Elements Guide](./Custom-Elements.md)
- [Best Practices](./Best-Practices.md)
