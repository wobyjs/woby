# Render Append Mode Fix

## Issue Identified

When testing the `TestRenderAppend` component, there was a critical bug in the `render` function implementation.

### The Problem

**File:** `woby/src/methods/render.ts` (line 14)

The original code was:
```typescript
export const render = (child: Child, parent?: Element | null | ShadowRoot, options?: { append?: boolean }): Disposer => {
    if (!parent || !(parent instanceof HTMLElement || parent instanceof ShadowRoot)) throw new Error('Invalid parent node')

    // ❌ BUG: This line ALWAYS clears content, even in append mode!
    parent.textContent = ''
    let node: HTMLElement | null = null

    return useRoot((stack, dispose) => {
        if (options?.append)
            if (isFunction(child) && isFunctionReactive(child))
                useEffect(() => parent.append(node = $$(child) as HTMLElement))
            else
                parent.append(node = $$(child) as HTMLElement)
        else
            setChild(parent, child, FragmentUtils.make(), stack)
        // ... rest of code
    })
}
```

### Impact

Even when using `{ append: true }`, the function would:
1. **Clear all existing content** from the parent element (line 14)
2. Then append the new content

This completely defeated the purpose of the append option, making it behave identically to replace mode.

### User-Visible Behavior

In `TestRenderAppend.tsx`:
- Clicking "Render Append (keep existing)" button would **NOT** keep existing content
- Both buttons would behave the same way (replacing content)
- The append feature was non-functional

## The Fix

**Solution:** Move the `parent.textContent = ''` line inside the `else` block (replace mode only).

### Fixed Code

```typescript
export const render = (child: Child, parent?: Element | null | ShadowRoot, options?: { append?: boolean }): Disposer => {
    if (!parent || !(parent instanceof HTMLElement || parent instanceof ShadowRoot)) throw new Error('Invalid parent node')

    let node: HTMLElement | null = null

    return useRoot((stack, dispose) => {
        if (options?.append) {
            // ✅ Append mode: don't clear existing content
            if (isFunction(child) && isFunctionReactive(child))
                useEffect(() => parent.append(node = $$(child) as HTMLElement))
            else
                parent.append(node = $$(child) as HTMLElement)
        } else {
            // ✅ Replace mode: clear content first
            parent.textContent = ''
            setChild(parent, child, FragmentUtils.make(), stack)
        }

        return (): void => {
            dispose(stack)

            if (options?.append)
                parent.removeChild(node!)
            else
                parent.textContent = ''
        }
    })
}
```

## Changes Made

1. **Removed** the unconditional `parent.textContent = ''` from line 14
2. **Added** curly braces `{}` to the `if (options?.append)` block for clarity
3. **Moved** `parent.textContent = ''` into the `else` block (replace mode only)
4. **Added** comments to clarify append vs replace modes

## Testing

### Test Component: TestRenderAppend.tsx

**Before Fix:**
- Click "Render Append" → Content replaced (BUG)
- Click "Render Replace" → Content replaced
- Result: Both buttons do the same thing ❌

**After Fix:**
- Click "Render Append" → New content added AFTER existing content ✅
- Click "Render Replace" → Existing content cleared, then new content added ✅
- Result: Buttons behave differently as expected ✅

### Expected Behavior

#### Append Mode (`{ append: true }`)
```typescript
const container = document.getElementById('app')
container.innerHTML = '<p>Initial content</p>'

// This should KEEP initial content and ADD more
render(<p>Additional content</p>, container, { append: true })

// Result: <p>Initial content</p><p>Additional content</p> ✅
```

#### Replace Mode (default)
```typescript
const container = document.getElementById('app')
container.innerHTML = '<p>Initial content</p>'

// This should CLEAR initial content and REPLACE
render(<p>New content</p>, container)

// Result: <p>New content</p> ✅
```

## Related Files

- **Implementation:** `woby/src/methods/render.ts`
- **Test Component:** `woby/demo/playground/src/TestRenderAppend.tsx`
- **Test Registry:** `woby/demo/playground/index.tsx`

## Verification Steps

1. Start the playground dev server:
   ```bash
   cd woby/demo/playground
   pnpm dev
   ```

2. Navigate to TestRenderAppend test

3. Observe the container with "Initial content"

4. Click "Render Append (keep existing)" button
   - **Expected:** See both "Initial content" AND "Appended content 1"
   - **Before fix:** Would only see "Appended content 1"

5. Click "Render Replace (clears existing)" button
   - **Expected:** See only "Replaced content"
   - **Behavior:** Same as before (working correctly)

## Memory Reference

This fix aligns with previous knowledge about:
- SSR rendering fixes for append and renderToString
- The synchronous nature of renderToString
- Proper DOM manipulation patterns in woby

## Conclusion

The append option is now fully functional and provides the intended incremental content addition behavior without clearing existing content.

---

**Date Fixed:** 2026-03-26  
**Issue Type:** Logic error - premature DOM clearing  
**Severity:** High - feature completely broken  
**Fix Complexity:** Low - single line repositioning
