# Woby Test Conversion Quest

## Objective
Fix all 251 test files in `d:\Developments\tslib\@woby\woby\demo\playground\test.playground\test.playwright\` that contain placeholder implementations like `await expect(outerHTML).toBe('<p>content</p>')` by implementing the actual component logic from their corresponding source files.

## Current Status
- Files identified with placeholder implementations: 251 files
- Pattern to search for: `await expect(outerHTML).toBe('<p>content</p>')`
- Files need actual API implementation, not just placeholder content

## Systematic Fix Process

### 1. Identification Phase
```bash
findstr /S /C:"<p>content</p>" "d:\Developments\tslib\@woby\woby\demo\playground\test.playground\test.playwright\*.spec.tsx"
```

### 2. For Each File Found:

#### Step A: Examine Source File
- Look for corresponding `.tsx` file with same name
- Understand the actual component implementation
- Note the expected output from test configuration
- Check if component uses `useInterval` for dynamic behavior

#### Step B: Update Spec File Implementation
- Replace placeholder content with actual h() function calls
- Implement proper component logic matching source file
- Use correct observable patterns and attribute handling
- Apply React 16 style syntax for children when needed
- **For components with useInterval**: Expose observables globally and use page.evaluate for step-by-step testing

#### Step C: Update Test Assertions
- Replace generic `<p>content</p>` assertions
- Use actual expected output from source file's test configuration
- Check for innerHTML instead of just outerHTML when appropriate
- Select main container div instead of individual paragraphs
- **For dynamic components**: Use step-by-step verification with page.evaluate calls

#### Step D: Verify Implementation
```bash
pnpm test [filename].spec.tsx
```

## Common Patterns and Solutions

### Pattern 1: Static Component Implementation
```typescript
// Before (placeholder):
h('p', null, 'content')

// After (actual implementation):
h('p', { tabIndex: true }, 'true')  // Example from TestTabIndexBooleanStatic
```

### Pattern 2: Observable Component Implementation
```typescript
// Before (placeholder):
h('p', null, 'content')

// After (actual implementation):
const o = $(false)
h('p', { 'data-red': o }, 'content')  // Example from TestAttributeObservableBoolean
```

### Pattern 3: Template Component Implementation
```typescript
// Before (placeholder):
h('p', null, 'content')

// After (actual implementation):
const Templated = template<{ class: string, color: string }>((props: any) => {
    return h('div', { className: props.class } as any,
        h('span', null, 'outer ', 
            h('span', { 'data-color': props.color } as any, 'inner')
        )
    )
})
h(Templated, { class: 'red', color: 'blue' })
```

### Pattern 4: Ternary Component Implementation
```typescript
// Before (placeholder):
h('p', null, 'content')

// After (actual implementation):
h(Ternary, { when: true } as any, h('p', null, 'true (1)'), h('p', null, 'false (1)'))
```

### Pattern 5: Dynamic Component with useInterval (New Technique)
```typescript
// Before (placeholder):
h('p', null, 'content')

// After (step-by-step implementation):
// In page.evaluate - setup phase:
const level = $(1)
window.testLevel = level  // Expose globally
const element = h('div', null,
    h('h3', null, 'Component Name'),
    h('p', null, () => `h${level()}`)
)
render(element, document.body)

// In test verification - step-by-step:
// Initial state
await expect(innerHTML).toContain('<p>h1</p>')

// Step 1: Update observable
await page.evaluate(() => {
    const level = window.testLevel
    level(2)
})
await page.waitForTimeout(50)
await expect(innerHTML).toContain('<p>h2</p>')
```

### Pattern 6: Test Assertion Updates
```typescript
// Before (placeholder):
const paragraph = page.locator('p')
const outerHTML = await paragraph.evaluate(el => el.outerHTML)
await expect(outerHTML).toBe('<p>content</p>')

// After (proper implementation):
const container = page.locator('div').first()
const innerHTML = await container.evaluate(el => el.innerHTML)
await expect(innerHTML).toBe('<h3>Component Name</h3><p>expected content</p>')
```

## Key Implementation Principles

### 1. API-Centric Approach
- Implement actual Woby API functionality
- Don't just make tests pass with placeholder content
- Use proper h() function calls with correct parameters
- Apply React 16 style syntax for children arrays

### 2. Proper Component Patterns
- Static components: Direct rendering without intervals
- Dynamic components: Use observables with proper registration
- Template components: Implement template function correctly
- Conditional components: Use Ternary/If with proper when props
- **Components with useInterval**: Expose observables globally and test step-by-step

### 3. Test Structure Updates
- Use container div selection instead of individual elements
- Check innerHTML to see complete structure
- Wait appropriate time for rendering (50ms between steps)
- Use proper TypeScript typing for observables
- **For dynamic tests**: Use page.evaluate to manipulate observables directly

### 4. Attribute Handling
- Use `as any` casting to bypass TypeScript restrictions
- Handle boolean attributes correctly (tabIndex, disabled, etc.)
- Implement observable attributes properly
- Handle attribute removal when values are null

### 5. Dynamic Component Testing (New)
- Expose observables to window object for testing access
- Use page.evaluate to directly manipulate observable values
- Implement step-by-step verification for each state change
- Wait for rendering between state changes (50ms)
- Verify each expected state with proper assertions

## Common File Types to Fix

### Attribute Tests
- TestAttributeBooleanStatic.spec.tsx
- TestAttributeObservableBoolean.spec.tsx
- TestAttributeRemoval.spec.tsx
- TestTabIndexBooleanStatic.spec.tsx
- TestTabIndexBooleanFunction.spec.tsx

### Component Tests
- TestComponentStatic.spec.tsx
- TestComponentObservable.spec.tsx
- TestTernaryStatic.spec.tsx
- TestTernaryFunction.spec.tsx
- TestIfStatic.spec.tsx
- TestIfFunction.spec.tsx

### Dynamic Component Tests (useInterval)
- TestABCD.spec.tsx (reference implementation)
- TestDynamicFunctionComponent.spec.tsx (reference implementation)
- TestComponentFunction.spec.tsx
- TestComponentObservableDirect.spec.tsx
- TestDynamicFunctionProps.spec.tsx
- TestDynamicObservableComponent.spec.tsx
- TestDynamicObservableProps.spec.tsx

### Template Tests
- TestTemplateExternal.spec.tsx
- TestTemplateSVG.spec.tsx

### Data Type Tests
- TestBigIntStatic.spec.tsx
- TestBigIntRemoval.spec.tsx
- TestBooleanStatic.spec.tsx
- TestBooleanRemoval.spec.tsx
- TestNumberStatic.spec.tsx
- TestStringStatic.spec.tsx

### Class/Style Tests
- TestClassesArrayStatic.spec.tsx
- TestClassesArrayFunction.spec.tsx
- TestStyleStaticNumeric.spec.tsx
- TestStyleFunctionString.spec.tsx

## Quality Assurance

### Test Verification
- Each file should pass: `pnpm test [filename].spec.tsx`
- Verify actual API functionality, not just test passing
- Check that component renders expected HTML structure
- Ensure proper observable behavior for dynamic components
- **For dynamic tests**: Verify each state transition works correctly

### Code Quality
- Maintain consistent coding patterns
- Use proper TypeScript typing
- Follow existing test structure conventions
- Apply proper error handling
- **For dynamic components**: Use global observable exposure pattern consistently

## Success Criteria
- All 251 files fixed and passing
- Each implementation matches source file logic
- Tests verify actual API functionality
- No placeholder implementations remaining
- All tests pass with `pnpm test`
- **Dynamic components properly test state transitions**

## Tools and Commands

### Search for Placeholder Files
```bash
findstr /S /C:"<p>content</p>" "d:\Developments\tslib\@woby\woby\demo\playground\test.playground\test.playwright\*.spec.tsx"
```

### Test Individual Files
```bash
pnpm test [filename].spec.tsx
```

### Test All Files
```bash
pnpm test
```

## File Processing Order
1. Start with files that have clear source file implementations
2. Handle static components first, then dynamic components
3. Process template and complex components
4. **For dynamic components with useInterval**: Use the page.evaluate technique
5. Verify all files pass after each batch of fixes

This quest ensures all test files properly implement the Woby API rather than using placeholder content, creating a comprehensive and accurate test suite.