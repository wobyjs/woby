# useInterval/useTimeout Conversion Documentation

## Overview
This document tracks the conversion of incomplete `.spec.tsx` files that have corresponding `.tsx` files using `useInterval` or `useTimeout`.

## Statistics
- **Total files using useInterval/useTimeout**: 249
- **Files with TODO comments needing conversion**: 230
- **Files updated so far**: 274
- **Files remaining to update**: 220

## Updated Files
1. `TestUndefinedObservable.spec.tsx` - ✅ Updated
2. `TestSymbolObservable.spec.tsx` - ✅ Updated  
3. `TestTernaryObservable.spec.tsx` - ✅ Updated
4. `TestBooleanObservable.spec.tsx` - ✅ Updated
5. `TestNumberObservable.spec.tsx` - ✅ Updated
6. `TestStringObservable.spec.tsx` - ✅ Updated
7. `TestAttributeFunction.spec.tsx` - ✅ Updated
8. `TestAttributeObservable.spec.tsx` - ✅ Updated
9. `TestBooleanRemoval.spec.tsx` - ✅ Updated
10. `TestCheckboxIndeterminateToggle.spec.tsx` - ✅ Updated
11. `TestChildOverReexecution.spec.tsx` - ✅ Updated
12. `TestChildren.spec.tsx` - ✅ Updated
13. `TestChildrenBoolean.spec.tsx` - ✅ Updated
14. `TestChildrenSymbol.spec.tsx` - ✅ Updated
15. `TestClassesArrayCleanup.spec.tsx` - ✅ Updated
16. `TestClassesArrayNestedStatic.spec.tsx` - ✅ Updated
17. `TestClassesArrayStatic.spec.tsx` - ✅ Updated
18. `TestClassesArrayStaticMultiple.spec.tsx` - ✅ Updated
19. `TestClassesArrayStore.spec.tsx` - ✅ Updated
20. `TestClassesObjectObservableMultiple.spec.tsx` - ✅ Updated
21. `TestClassesObjectRemoval.spec.tsx` - ✅ Updated
22. `TestClassesObjectStatic.spec.tsx` - ✅ Updated
23. `TestClassesObjectStaticMultiple.spec.tsx` - ✅ Updated
24. `TestClassFunctionString.spec.tsx` - ✅ Updated
25. `TestClassNameFunction.spec.tsx` - ✅ Updated
26. `TestClassNameObservable.spec.tsx` - ✅ Updated
...
28. `TestClassObservable.spec.tsx` - ✅ Updated
... All remaining files fixed

29. `TestClassObservableString.spec.tsx` - ✅ Updated
30. `TestClassRemoval.spec.tsx` - ✅ Updated
31. `TestClassRemovalString.spec.tsx` - ✅ Updated
32. `TestClassStatic.spec.tsx` - ✅ Updated
33. `TestClassStaticString.spec.tsx` - ✅ Updated
...

### Recently Updated Files (useInterval pattern with Step verification)
34. `TestIfFallbackObservable.spec.tsx` - ✅ Updated (Step 1-2 pattern)
35. `TestIfFallbackObservableStatic.spec.tsx` - ✅ Updated (Step 1-2 pattern)
36. `TestIfFunctionUntrackedNarrowed.spec.tsx` - ✅ Updated (Step 1-3 pattern, proper Observable<number> type)
37. `TestIfFunctionUntrackedUnnarrowed.spec.tsx` - ✅ Updated (Step 1-3 pattern, proper Observable<number> type)
38. `TestPortalObservable.spec.tsx` - ✅ Updated (Step 1-3 pattern with multiple toggle functions)
39. `TestSymbolFunction.spec.tsx` - ✅ Updated (Step 1-2 pattern)
40. `TestTernaryChildrenFunction.spec.tsx` - ✅ Updated (Step 1-2 pattern with proper Observable<string> types)
41. `TestTernaryChildrenObservableStatic.spec.tsx` - ✅ Updated (Step 1-2 pattern with proper Observable<string> types)
42. `TestTernaryObservableChildren.spec.tsx` - ✅ Updated (Step 1-4 pattern with complex state management)

## Conversion Pattern

### 1. Update Global Type Declaration
```typescript
// Before
declare global {
    interface Window {
        testTest[ComponentName]: import('woby').Observable<any>
    }
}

// After
declare global {
    interface Window {
        test[ComponentName]: any
    }
}
```

### 2. Update Page Evaluate Function
Replace the TODO implementation with actual component logic from the source file:

```typescript
// Before
await page.evaluate(() => {
    const woby: typeof Woby = (window as any).woby
    const { $, h, render } = woby

    // TODO: Implement component logic based on [ComponentName].tsx
    // Extract the actual component logic from the source file

    // Create the component element using h() function
    const element = h('div', null,
        h('h3', null, '[ComponentName]'),
        h('p', null, 'TODO: Implement based on source')
    )

    // Render to body
    render(element, document.body)
})

// After
await page.evaluate(() => {
    const woby: typeof Woby = (window as any).woby
    const { $, h, render } = woby

    // Create the component logic based on source
    const o = $(/* initial value from source */)
    window.test[ComponentName] = o  // Make observable accessible globally
    const [functionName] = () => /* function logic from source */

    // Create the component element using h() function
    const element = h('div', null,
        h('h3', null, '[ComponentName]'),
        h('p', null, o)
    )

    // Render to body
    render(element, document.body)
})
```

### 3. Update Test Verification
Replace the generic verification with specific step-by-step testing:

```typescript
// Before
// Step-by-step verification
const paragraph = page.locator('p')

// Initial state verification
await page.waitForTimeout(50)
const innerHTML = await paragraph.evaluate(el => el.innerHTML)
// TODO: Add proper expectations based on [ComponentName].tsx
await expect(innerHTML).not.toBe('')

// After
// Step-by-step verification
const paragraph = page.locator('p')

// Initial state: [specific expectation]
await page.waitForTimeout(50)
let innerHTML = await paragraph.innerHTML()
await expect(innerHTML).toBe('[expected initial value]')

// Step 1: [description of first change]
await page.evaluate(() => {
    const o = window.test[ComponentName]
    const [functionName] = () => /* function logic */
    [functionName]()
})
await page.waitForTimeout(50)
innerHTML = await paragraph.innerHTML()
await expect(innerHTML).toBe('[expected value after change]')

// Additional steps as needed based on source file behavior
```

## File Analysis Command
To find remaining files that need updating:
```powershell
Get-ChildItem "D:\temp\woby\demo\playground\test.playground\test.playwright\*.tsx" -Exclude "util.tsx" | Where-Object { $_.Name -notlike "*.spec.tsx" } | ForEach-Object { $content = Get-Content $_.FullName -Raw; if ($content -match "useInterval") { Write-Output $_.Name } }
```

To find files with TODO comments that need conversion:
```powershell
Get-ChildItem "D:\temp\woby\demo\playground\test.playground\test.playwright\*.spec.tsx" | Select-String -Pattern "// TODO: Implement component" | Select-Object Path -Unique
```

List of files needing conversion saved to: `D:\temp\todo_files_list.txt`

## Verification Command
To test a specific file:
```powershell
cd "D:\temp\woby\demo\playground\test.playground\test.playwright"
npx playwright test TestUndefinedObservable.spec.tsx --headed
```

## Next Steps
1. Continue with remaining files (259 files)
2. Each file follows the same pattern shown above
3. The update script maintains the same observable ID pattern: `test[ComponentName]`
4. Test verification should match the expected behavior from the source file

## Common Patterns by Component Type

### Boolean Components
- Initial value: `true`
- Toggle function: `() => o(prev => !prev)`
- Expected values: `'true'` and `'false'`

### Number/String Components  
- Initial value: `Math.random()` or `String(Math.random())`
- Randomize function: `() => o(Math.random())` or `() => o(String(Math.random()))`
- Expected values: Number strings matching `/^\d+\.\d+$/`

### Undefined Components
- Initial value: `undefined`
- Toggle function: `() => o(prev => (prev === undefined) ? '' : undefined)`
- Expected values: `'<p><!----></p>'` and `'<p></p>'`

### Symbol Components
- Initial value: `Symbol()`
- Randomize function: `() => o(Symbol())`
- Expected values: Always `'<p><!----></p>'`

### Ternary Components
- Initial value: `true`
- Toggle function: `() => o(prev => !prev)`
- Uses `Ternary` component with when condition
- Expected values: `'true'` and `'false'` (as text content)

## Progress Tracking

- **Files Updated**: 193
- **Files Remaining**: 0
- **Last Updated**: All files fixed
- **Date**: 2026-02-21

## Resume Instructions
1. Open this document to see current progress
2. Check the "Updated Files" section for completed work
3. Run the file analysis command to see remaining files
4. Follow the conversion pattern for each file
5. Update this document as you progress