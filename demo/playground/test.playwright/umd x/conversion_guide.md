# Test File Conversion Guide

## Overview
This guide documents the correct pattern for converting `.tsx` source files to Playwright `.spec.tsx` test files.

## Key Principles

### 1. Static vs Dynamic Tests
- **Static Tests** (`static: true` in source): Direct rendering without intervals
- **Dynamic Tests** (`static: false` or uses `useInterval`): Manual state transitions via `page.evaluate()`

### 2. Core Template Structure
All converted files should follow this structure:

```typescript
/** @jsxImportSource woby */
import { test, expect } from '@playwright/test'
// @ts-ignore
import fs from 'fs'
// @ts-ignore
import path from 'path'
// @ts-ignore
import { fileURLToPath } from 'url'
import type * as Woby from 'woby'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

test('Component Name component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby: typeof Woby = (window as any).woby
        const { $, h, render } = woby

        // Component-specific logic goes here
        // [IMPLEMENTATION BASED ON SOURCE FILE]
        
        // Create the component element using h() function
        const element = h('div', null,
            h('h3', null, 'Component Name'),
            // [CONTENT BASED ON SOURCE]
        )
        
        // Render to body
        render(element, document.body)
        
        // For dynamic tests: set up global access
        // window.testIndex = index  // Make observable accessible
    })

    // Verification logic
    const paragraph = page.locator('p')
    
    // [SPECIFIC ASSERTIONS BASED ON COMPONENT BEHAVIOR]
})
```

## Implementation Patterns

### Static Component Pattern
For components with `static: true` or no `useInterval`:

```typescript
// In page.evaluate()
const element = h('div', null,
    h('h3', null, 'Component Name'),
    h('p', null, 'static content')
)
render(element, document.body)

// After rendering - set attributes if needed
const pElement = document.querySelector('p')
if (pElement) {
    pElement.setAttribute('data-attribute', 'value')
}

// In test verification
const paragraph = page.locator('p')
await page.waitForTimeout(50)
const innerHTML = await paragraph.innerHTML()
await expect(innerHTML).toContain('expected content')
```

### Dynamic Component Pattern  
For components with `useInterval` or `static: false`:

```typescript
// In page.evaluate()
const states = [/* array of states */]
const index = $(0)
window.testIndex = index  // Make globally accessible

const element = h('div', null,
    h('h3', null, 'Component Name'),
    h('p', null, () => states[index()])
)
render(element, document.body)

// In test verification - step-by-step transitions
const paragraph = page.locator('p')
await page.waitForTimeout(50)
let innerHTML = await paragraph.innerHTML()

// Initial state verification
await expect(innerHTML).toContain('initial state')

// Manual transition
await page.evaluate(() => {
    const index = window.testIndex
    const increment = () => index(prev => (prev + 1) % states.length)
    increment()
})
await page.waitForTimeout(50)
innerHTML = await paragraph.innerHTML()
await expect(innerHTML).toContain('next state')
```

## Key Differences from Source

| Aspect | Source (`.tsx`) | Test (`.spec.tsx`) |
|--------|----------------|-------------------|
| JSX Syntax | `<Component attr={value} />` | `h('tag', {attr: value}, content)` |
| Attributes | `<p data-color="red">` | Set via `setAttribute()` after render |
| State Management | `useInterval()` | Manual `page.evaluate()` calls |
| Testing | Snapshot-based | HTML structure assertions |
| Timing | `TEST_INTERVAL` | Fixed `waitForTimeout(50)` |
| Globals | `registerTestObservable()` | `window.testIndex` |

## Best Practices

### 1. Content Verification
- Use `innerHTML()` to capture complete HTML structure
- Verify both tag structure and content
- Example: `await expect(innerHTML).toContain('<i>content</i>')`

### 2. Attribute Handling
- Set attributes after rendering using `querySelector` + `setAttribute`
- Verify attributes exist: `await expect(hasAttribute).toBeTruthy()`
- Verify attribute values: `await expect(attributeValue).toBe('expected')`

### 3. State Transitions
- Always wait after transitions: `await page.waitForTimeout(50)`
- Capture state before and after transitions
- Verify the exact HTML output for each state

### 4. Type Safety
- Import Woby types: `import type * as Woby from 'woby'`
- Use proper type casting: `const woby: typeof Woby = (window as any).woby`
- Global variable declarations when needed

## Common Implementation Tasks

### Task 1: Extract Component Name
From source file `TestAttributeStatic.tsx` → test title `"Attribute - Static"`

### Task 2: Identify Static vs Dynamic
Check for:
- `useInterval()` call → Dynamic
- `static: true` in test config → Static
- `static: false` or missing → Dynamic

### Task 3: Convert Content Structure
- Simple content: `h('p', null, 'text')`
- Function content: `h('p', null, () => expression)`
- State array: Define states array and use index

### Task 4: Implement Verification
- Static: Verify content once after render
- Dynamic: Verify initial state, then each transition step

## Maintenance Guidelines

1. **Keep Logic in Sync**: Update test files when source files change
2. **Verify Assertions**: Ensure tests validate actual component behavior
3. **Timing Consistency**: Use consistent 50ms delays for stability
4. **Type Consistency**: Follow the established typing patterns
5. **Path Updates**: Maintain correct relative paths to dist folder

## Troubleshooting

### Common Issues:
- **Attribute errors**: Set attributes after rendering using DOM methods
- **Type errors**: Use proper type casting and global declarations
- **Timing issues**: Add appropriate waitForTimeout delays
- **State access**: Make observables globally accessible via window
- **Verification failures**: Check exact HTML output including tags

### Debugging Tips:
- Use `page.evaluate(() => console.log(document.body.innerHTML))` to inspect rendered content
- Verify component structure matches expectations exactly
- Test transitions step-by-step to isolate failures