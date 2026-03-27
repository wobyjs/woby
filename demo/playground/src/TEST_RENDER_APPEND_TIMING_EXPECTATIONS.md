# TestRenderAppend - Timing & Expectations Guide

## Critical Understanding: SSR vs DOM Expectations

### Two Different Validation Layers

```typescript
TestRenderAppend.test = {
    static: false,  // Dynamic due to client-side appends
    expect: () => {
        // 1️⃣ SSR EXPECTATION (renderToString)
        // What renderToString returns - STATIC HTML ONLY
        const ssrResult = renderToString(ssrComponent)
        // Contains: Initial structure, NO client-side appends
        
        // 2️⃣ DOM EXPECTATION (TestSnapshots validation)
        // What appears in browser - DYNAMIC with timing
        return expectedAfterTiming
        // Contains: Initial + Static appends based on timing
    }
}
```

---

## Timeline Breakdown

### Code Execution Flow

```typescript
setTimeout(() => {          // t=0ms: Effect starts
    if (container) {
        render(<p>Static append 1</p>, container, { append: true })
        // t≈0-10ms: "Static append 1" added ✅
        
        setTimeout(() => {  // t=50ms: Second timeout fires
            render(<p>Static append 2</p>, container, { append: true })
            // t≈50-60ms: "Static append 2" added ✅
            
            setTimeout(() => {  // t=100ms: Dispose timeout fires
                dispose2()
                // t≈100-110ms: "Static append 2" removed ✅
            }, 100)
        }, 50)
    }
}, 0)
```

### Visual Timeline

```
┌─────────────────────────────────────────────────────────────┐
│ Time    │ DOM Content                                      │
├─────────┼──────────────────────────────────────────────────┤
│ t=0ms   │ <div>                                            │
│         │   <p>Initial content</p>                         │
│         │ </div>                                           │
│         │                                                  │
│ t=10ms  │ <div>                                            │
│         │   <p>Initial content</p>                         │
│         │   <p>Static append 1</p>  ← Added               │
│         │ </div>                                           │
│         │                                                  │
│ t=60ms  │ <div>                                            │
│         │   <p>Initial content</p>                         │
│         │   <p>Static append 1</p>                         │
│         │   <p>Static append 2</p>  ← Added               │
│         │ </div>                                           │
│         │                                                  │
│ t=110ms │ <div>                                            │
│         │   <p>Initial content</p>                         │
│         │   <p>Static append 1</p>                         │
│         │           ↑                                      │
│         │   <!-- Static append 2 removed -->              │
│         │ </div>                                           │
│         │                                                  │
│ t=200ms+│ Same as t=110ms (stable state)                  │
└─────────────────────────────────────────────────────────────┘
```

---

## Why SSR ≠ DOM

### SSR (Server-Side Rendering)

**What happens:**
```typescript
const ssrResult = renderToString(<TestRenderAppend />)
```

**Process:**
1. Component function executes synchronously
2. Returns JSX structure
3. **setTimeout callbacks DON'T run** (client-side only)
4. **useEffect DON'T run** (browser-only hook)
5. Returns static HTML string

**Result:**
```html
<h3>Render - Append Option</h3>
<div style="border: 1px solid blue; padding: 10px; margin: 5px;" id="">
  <p>Initial content</p>
</div>
<div style="margin-top: 10px;">
  <button>Render Append (keep existing)</button>
  <button>Render Replace (clears existing)</button>
</div>
```

**Key Point:** NO static appends appear because setTimeout is a browser API that doesn't execute during SSR!

---

### DOM (Browser Rendering)

**What happens:**
```typescript
export default () => <TestSnapshots Component={TestRenderAppend} />
```

**Process:**
1. Component renders in browser
2. useEffect runs after mount
3. setTimeout callbacks execute at scheduled times
4. render() calls manipulate actual DOM
5. TestSnapshots captures mutations over time

**Result (at different times):**
```javascript
// t=0ms (before first setTimeout fires)
'<div><p>Initial content</p></div>...'

// t=50ms (after first append)
'<div><p>Initial content</p><p>Static append 1</p></div>...'

// t=100ms (after second append)
'<div><p>Initial content</p><p>Static append 1</p><p>Static append 2</p></div>...'

// t=200ms+ (after dispose2)
'<div><p>Initial content</p><p>Static append 1</p></div>...'
```

---

## The Expectation Logic

### Current Implementation

```typescript
expect: () => {
    // ✅ SSR VALIDATION
    // Checks that renderToString works correctly
    const ssrResult = renderToString(ssrComponent)
    if (ssrResult !== expectedFull) {
        assert(false, `SSR mismatch`)
    }
    
    // ✅ DOM VALIDATION (returned value)
    // This is what TestSnapshots compares against
    // Must match the FINAL stable state (after all timeouts complete)
    
    const baseStructure = '<div style="...">'
    const initialContent = '<p>Initial content</p>'
    const buttons = '</div>...'
    
    // After dispose2() runs, we have:
    // Initial + Static append 1 (append 2 was removed)
    const expectedAfterTiming = `${baseStructure}${initialContent}<p>Static append 1</p>${buttons}`
    
    return expectedAfterTiming  // ← TestSnapshots uses THIS
}
```

### Why Return Final State?

TestSnapshots takes multiple snapshots over time:
1. Initial render (t=0ms)
2. After first mutation (t≈10ms)
3. After second mutation (t≈60ms)
4. After dispose (t≈110ms)
5. Continues monitoring...

By returning the **final stable state**, we're saying:
> "After all dynamic behavior completes, THIS is what the DOM should look like"

The test framework validates that:
- ✅ Component eventually reaches this state
- ✅ No unexpected mutations after stabilization
- ✅ Structure matches expectation exactly

---

## Console Output You'll See

When you run the test:

```log
✅ Static append 1 added
✅ Static append 2 added
✅ dispose2() called - "Static append 2" should be removed
✅ [TestRenderAppend] SSR test passed: <h3>Render - Append Option</h3>...
✅ Expect function test passed for TestRenderAppend expect: <div style="..."><p>Initial content</p><p>Static append 1</p>...</div>
```

If there's a mismatch:

```log
❌ [TestRenderAppend]: Expected actual '<div>...<p>Static append 1</p><p>Static append 2</p>...</div>' 
   to match one of the expected values '<div>...<p>Static append 1</p>...</div>'
```

This would mean the snapshot was taken BEFORE dispose2 ran (timing issue).

---

## Adjusting for Different Timings

### If You Want to Test Intermediate States

**Option 1: Return array of expected states**
```typescript
expect: () => {
    const states = [
        '<div><p>Initial content</p></div>',                    // t=0
        '<div><p>Initial</p><p>Static 1</p></div>',             // t=50ms
        '<div><p>Initial</p><p>S1</p><p>S2</p></div>',          // t=100ms
        '<div><p>Initial</p><p>Static 1</p></div>'              // t=200ms+
    ]
    return states[3] // Return final state
}
```

**Option 2: Add explicit wait**
```typescript
useEffect(() => {
    // Wait for all timeouts to complete before validating
    const timer = setTimeout(() => {
        // Now DOM should match expectation
    }, 200) // Longer than all internal timeouts combined
    
    return () => clearTimeout(timer)
})
```

---

## Key Takeaways

### 1. SSR is Static
- Only captures initial JSX structure
- No browser APIs (setTimeout, useEffect)
- Use for testing server-rendered HTML

### 2. DOM is Dynamic
- Includes all client-side mutations
- Timing matters!
- Use for testing interactive behavior

### 3. Expectation Should Match Final State
- Return what DOM looks like AFTER all async operations
- Don't try to validate intermediate states unless necessary
- Trust the test framework to handle timing

### 4. dispose() Actually Works
- Calling dispose2() removes the appended node
- The DOM reverts to previous state
- This is visible in DevTools Elements panel

---

## Testing Checklist

Before committing changes:

- [ ] SSR expectation matches renderToString output exactly
- [ ] DOM expectation includes "Static append 1"
- [ ] DOM expectation does NOT include "Static append 2" (disposed)
- [ ] All console.log messages appear when running
- [ ] No TypeScript errors
- [ ] Test passes consistently (no flakiness)

---

## Debugging Tips

### If Test Fails

**Check 1: Is timing off?**
```typescript
// Increase internal delays to ensure completion
setTimeout(() => {
    // ... appends
}, 100) // ← Increase from 0 to give more time
```

**Check 2: Is structure wrong?**
```bash
# Look at actual error message
Expected actual 'ACTUAL_HTML' to match 'EXPECTED_HTML'

# Copy ACTUAL_HTML and compare manually
```

**Check 3: Is dispose not running?**
```typescript
// Add more logging
setTimeout(() => {
    console.log('About to call dispose2')
    dispose2()
    console.log('dispose2 called, checking DOM...')
    console.log(container.innerHTML)
}, 100)
```

---

## Related Files

- Test implementation: `TestRenderAppend.tsx`
- TestSnapshots component: `util.tsx`
- render() function: `woby/src/methods/render.ts`
- Documentation: `RENDER_APPEND_STATIC_AND_DISPOSE.md`

---

**Last Updated:** 2026-03-26  
**Status:** ✅ Complete with proper timing-aware expectations
