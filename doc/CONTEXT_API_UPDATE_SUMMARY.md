# Context API Update Summary

## Overview

**Note: This is a historical document.** The deprecation and removal of `useMountedContext` and `useAttached` has been completed. The unified `useContext` hook now handles all context needs for both JSX/TSX components and custom elements.

## What Changed

**Completed:** The deprecated hooks have been removed from the codebase and all documentation has been updated.

### Deprecated APIs
- ❌ `useMountedContext` - Deprecated
- ❌ `useAttached` - Deprecated

### Recommended API
- ✅ `useContext` - Now works everywhere (JSX/TSX components AND custom elements)

## Files Updated

### Core Documentation
1. **doc/CONTEXT_API.md** - Main Context API documentation
   - Added deprecation notice for `useMountedContext`
   - Updated examples to use `useContext`
   - Added HTML and TSX usage examples
   
2. **doc/CONTEXT_API_EXAMPLES.md** - NEW comprehensive examples file
   - Basic context usage
   - Multiple contexts
   - Nested contexts
   - Custom element patterns
   - Function children patterns
   - Dynamic context providers
   - HTML via dangerouslySetInnerHTML

3. **doc/CONTEXT_API_QUICK_REFERENCE.md** - NEW quick reference guide
   - TL;DR section
   - Common patterns
   - Migration checklist
   - Troubleshooting

4. **doc/DEPRECATION_useMountedContext_useAttached.md** - NEW deprecation notice
   - Migration guide
   - Before/after comparisons
   - Example patterns
   - Technical details

5. **readme.md** - Main README updated
   - Context API example updated to use `useContext`

6. **demo/docs/Context-API.md** - Demo documentation
   - Updated with new patterns
   - Added HTML and TSX examples

7. **doc/demos/Counter-Demo.md** - Counter demo guide
   - Removed `useMountedContext` references
   - Updated best practices

8. **doc/demos/Custom-Element-Practical-Guide.md** - Custom element guide
   - Updated context usage examples
   - Updated pitfall section

## Test Files Demonstrating New Patterns

The following test files showcase the updated patterns:

### Context Tests
1. **TestContextHook.tsx** - Basic TSX context usage
2. **TestContextHook.html.tsx** - Context in HTML custom elements
3. **TestContextComponents.tsx** - Component-based context
4. **TestContextDynamicContext.tsx** - Dynamic context with function children

### Custom Element Tests
5. **TestCustomElementBasic.tsx** - Basic custom element with context
6. **TestCustomElementContext.tsx** - Context in custom elements
7. **TestCustomElementContext.html.tsx** - HTML context usage
8. **TestCustomElementComprehensive.tsx** - Comprehensive context patterns
9. **TestCustomElementNested.tsx** - Nested context scenarios
10. **TestCustomElementSlots.tsx** - Slots with context

## Key Documentation Updates

### 1. Simplified API Message

**Old:**
```typescript
// Two different hooks needed
const value = useContext(Context) // For JSX/TSX
const [value, mount] = useMountedContext(Context) // For custom elements
```

**New:**
```typescript
// One hook for everything
const value = useContext(Context) // Works everywhere!
```

### 2. Updated Best Practices

**Before:**
- Use `useContext` for JSX/TSX components
- Use `useMountedContext` for custom elements

**After:**
- Use `useContext` for all context needs
- Same pattern everywhere

### 3. Cleaner Code Examples

**Before:**
```typescript
const MyElement = defaults(() => ({}), () => {
  const [value, mount] = useMountedContext(Context)
  return <div>{mount}Value: {value}</div>
})
```

**After:**
```typescript
const MyElement = defaults(() => ({}), () => {
  const value = useContext(Context)
  return <div>Value: {value}</div>
})
```

## Migration Path

### Step 1: Identify Usage
Search for `useMountedContext` and `useAttached` in your codebase.

### Step 2: Simple Replacement
Replace tuple return with direct value:
```typescript
// Before
const [value, mount] = useMountedContext(Context)

// After
const value = useContext(Context)
```

### Step 3: Remove Mounting Placeholders
Remove `{mount}` from render output.

### Step 4: Test
Verify context propagation still works correctly.

## Benefits of This Change

1. **Simpler Learning Curve**: One hook instead of two
2. **Consistent Patterns**: Same API everywhere
3. **Less Boilerplate**: No mounting placeholders needed
4. **Better DX**: Cleaner, more intuitive code
5. **Easier Maintenance**: Less code to maintain

## Example Patterns Reference

### Pattern 1: Basic Usage
```typescript
const ThemeContext = createContext('light')

const ThemedComponent = () => {
  const theme = useContext(ThemeContext)
  return <div className={theme}>Themed</div>
}
```

### Pattern 2: Multiple Contexts
```typescript
const MyElement = defaults(() => ({}), () => {
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

### Pattern 3: Nested Contexts
```typescript
<Context.Provider value="outer">
  <Consumer />
  <Context.Provider value="inner">
    <Consumer />
  </Context.Provider>
  <Consumer />
</Context.Provider>
```

### Pattern 4: HTML Custom Elements
```typescript
const Reader = defaults(() => ({}), () => {
  const ctx = useContext(readerContext)
  const oth = useContext(otherContext)
  return <p>{ctx} other: {oth}</p>
})

customElement('test-reader', Reader)

// Usage in HTML string
<div dangerouslySetInnerHTML={{
  __html: `<reader-context value="outer"><test-reader></test-reader></reader-context>`
}} />
```

### Pattern 5: Reactive Context Values
```typescript
const appTheme = $('dark')

return (
  <ThemeContext.Provider value={appTheme}>
    <ChildComponent />
  </ThemeContext.Provider>
)
```

## Testing Verification

All test files have been verified to work with the new pattern:
- ✅ SSR rendering works correctly
- ✅ Client-side hydration works
- ✅ Context propagation through custom elements
- ✅ Nested contexts work properly
- ✅ Multiple contexts can be consumed simultaneously
- ✅ Reactive context values update correctly

## Related Documentation

### Primary Documentation
- [Context API](./CONTEXT_API.md) - Main documentation
- [Context API Examples](./CONTEXT_API_EXAMPLES.md) - Comprehensive examples
- [Quick Reference](./CONTEXT_API_QUICK_REFERENCE.md) - Quick lookup guide
- [Deprecation Notice](./DEPRECATION_useMountedContext_useAttached.md) - Migration guide

### Related Guides
- [Custom Elements](./CUSTOM_ELEMENTS.md) - Custom element creation
- [Best Practices](./Best-Practices.md) - General best practices
- [Core Methods](./Core-Methods.md) - All core methods

### Demo Documentation
- [Counter Demo](./demos/Counter-Demo.md) - Practical counter example
- [Custom Element Guide](./demos/Custom-Element-Practical-Guide.md) - Step-by-step guide

## Implementation Notes

### How useContext Works Now

1. **Automatic Detection**: Detects whether in JSX component or custom element
2. **DOM Hierarchy**: Traverses DOM tree to find nearest provider
3. **Shadow DOM Support**: Works through shadow boundaries
4. **Slot Support**: Properly handles slotted content
5. **Reactive**: Maintains reactivity when values are observables

### Backward Compatibility

- Old code using `useMountedContext` still works but shows deprecation warnings
- No breaking changes to existing functionality
- Gradual migration path available

## Next Steps

1. ✅ Review updated documentation
2. ✅ Run test suite to verify all patterns work
3. ✅ Update any remaining references in codebase
4. ✅ Consider adding ESLint rule to flag deprecated hook usage
5. ✅ Plan for eventual removal of deprecated hooks in next major version

## Questions?

If you have questions about this update:
- Check the [Quick Reference](./CONTEXT_API_QUICK_REFERENCE.md) for common patterns
- Review the [Deprecation Notice](./DEPRECATION_useMountedContext_useAttached.md) for migration details
- See the [Examples](./CONTEXT_API_EXAMPLES.md) for comprehensive usage patterns
