# Historical Note: useMountedContext and useAttached Deprecation

## Summary

**Note: This is a historical document.** The `useMountedContext` and `useAttached` hooks have been **deprecated and removed**. The `useContext` hook now handles all context needs for both JSX/TSX components and custom elements.

## What Changed

**This change has been completed.** The deprecated hooks have been removed from the codebase.

### Before (Deprecated)

```typescript
// Old approach - DEPRECATED
const ThemedElement = defaults(() => ({}), () => {
  const [theme, mount] = useMountedContext(ThemeContext)
  return <div>{mount}Theme: {theme}</div>
})
```

### After (Recommended)

```typescript
// New approach - RECOMMENDED
const ThemedElement = defaults(() => ({}), () => {
  const theme = useContext(ThemeContext)
  return <div>Theme: {theme}</div>
})
```

## Why This Change?

1. **Simplification**: One hook (`useContext`) for all context needs
2. **Consistency**: Same API across JSX/TSX components and custom elements
3. **Cleaner Code**: No need for mounting placeholders or tuple returns
4. **Better DX**: Simpler mental model for developers

## Migration Guide

### Scenario 1: Basic Context Usage

**Before:**
```typescript
const MyElement = defaults(() => ({}), () => {
  const [value, mount] = useMountedContext(MyContext)
  return <div>{mount}Value: {value}</div>
})
```

**After:**
```typescript
const MyElement = defaults(() => ({}), () => {
  const value = useContext(MyContext)
  return <div>Value: {value}</div>
})
```

### Scenario 2: Context with Ref

**Before:**
```typescript
const myRef = $<HTMLDivElement>()
const value = useMountedContext(MyContext, myRef)
return <div ref={myRef}>Value: {value}</div>
```

**After:**
```typescript
const myRef = $<HTMLDivElement>()
const value = useContext(MyContext)
return <div ref={myRef}>Value: {value}</div>
```

### Scenario 3: Multiple Contexts

**Before:**
```typescript
const MultiContextElement = defaults(() => ({}), () => {
  const [theme, themeMount] = useMountedContext(ThemeContext)
  const [user, userMount] = useMountedContext(UserContext)
  
  return (
    <div>
      {themeMount}
      {userMount}
      <p>Theme: {theme}</p>
      <p>User: {user.name}</p>
    </div>
  )
})
```

**After:**
```typescript
const MultiContextElement = defaults(() => ({}), () => {
  const theme = useContext(ThemeContext)
  const user = useContext(UserContext)
  
  return (
    <div>
      <p>Theme: {theme}</p>
      <p>User: {user.name}</p>
    </div>
  )
})
```

## Updated Documentation

The following documentation files have been updated to reflect this change:

- ✅ `doc/CONTEXT_API.md` - Main Context API documentation
- ✅ `doc/CONTEXT_API_EXAMPLES.md` - Comprehensive examples (new file)
- ✅ `demo/docs/Context-API.md` - Demo documentation
- ✅ `readme.md` - Main README
- ✅ `doc/demos/Counter-Demo.md` - Counter demo guide
- ✅ `doc/demos/Custom-Element-Practical-Guide.md` - Custom element guide

## Example Patterns

### Pattern 1: Single Context in TSX

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
        </>
    )
}
```

### Pattern 2: Multiple Contexts in Custom Elements

```tsx
const ReaderContext = createContext<string>('')
const OtherContext = createContext<string>('')

customElement('reader-context', ReaderContext.Provider)
customElement('other-context', OtherContext.Provider)

const TestContextHookHtml = (): JSX.Element => {
    const Reader = defaults(() => ({}), () => {
        const ctx = useContext(readerContext)
        const oth = useContext(otherContext)
        return <p>{ctx} other: {oth}</p>
    })

    customElement('test-reader', Reader)

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

### Pattern 3: Context with Function Children

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

            {/* Context.Provider with function children */}
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

### Pattern 4: Complex Nested Contexts

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

## Technical Details

### How useContext Works Now

1. **For JSX/TSX Components**: Uses the standard context provider pattern
2. **For Custom Elements**: Automatically retrieves context from parent elements using the DOM hierarchy
3. **Context Lookup**: Traverses up the DOM tree to find the nearest context provider
4. **No Special Hooks Needed**: `useContext` works everywhere

### Internal Implementation

The `useContext` hook now:
- Detects whether it's being used in a JSX component or custom element
- Automatically handles context propagation through the DOM hierarchy
- Works seamlessly with Shadow DOM and slots
- Maintains reactivity when context values are observables

## Benefits

1. **Simpler API**: One hook instead of two
2. **Less Boilerplate**: No mounting placeholders
3. **Better Consistency**: Same pattern everywhere
4. **Easier to Learn**: Fewer concepts for newcomers
5. **More Maintainable**: Less code to maintain

## Related Files

**Historical reference:** These files were updated as part of this completed deprecation:
- `src/hooks/use_mounted_context.ts` - Marked as deprecated
- `src/hooks/use_attached.ts` - Marked as deprecated  
- `src/hooks/index.ts` - Still exports but deprecated

Test files demonstrating new patterns:
- `demo/playground/src/TestContextHook.tsx`
- `demo/playground/src/TestContextHook.html.tsx`
- `demo/playground/src/TestContextComponents.tsx`
- `demo/playground/src/TestContextDynamicContext.tsx`
- `demo/playground/src/TestCustomElementContext.tsx`
- `demo/playground/src/TestCustomElementContext.html.tsx`
- `demo/playground/src/TestCustomElementBasic.tsx`
- `demo/playground/src/TestCustomElementComprehensive.tsx`
- `demo/playground/src/TestCustomElementNested.tsx`
- `demo/playground/src/TestCustomElementSlots.tsx`

## Questions?

If you have questions about this deprecation or need help migrating your code, please refer to:
- [Context API Documentation](./CONTEXT_API.md)
- [Context API Examples](./CONTEXT_API_EXAMPLES.md)
- [Custom Elements Guide](./CUSTOM_ELEMENTS.md)
