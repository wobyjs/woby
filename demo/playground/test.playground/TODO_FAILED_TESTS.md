# Failed Playwright Tests - TODO List

## Currently Failing Tests

### High Priority (Critical Functionality)
- [ ] **TestAttributeFunction.spec.tsx** - Attribute - Function component
- [ ] **TestClassesObjectStoreMultiple.spec.tsx** - Classes - Object Store Multiple component
- [ ] **TestCleanupInnerPortal.spec.tsx** - TestCleanupInnerPortal component
- [ ] **TestCustomElementBasic.spec.tsx** - Custom Element Basic Functionality
- [ ] **TestCustomElementContext.spec.tsx** - Custom Element Context Functionality
- [ ] **TestCustomElementNested.spec.tsx** - Custom Element Nested Components
- [ ] **TestCustomElementSlots.spec.tsx** - Custom Element Slots Functionality
- [ ] **TestDynamicFunctionComponent.spec.tsx** - Dynamic - Function Component component
- [ ] **TestDynamicFunctionProps.spec.tsx** - Dynamic - Function Props component
- [ ] **TestDynamicHeading.spec.tsx** - Dynamic - Heading component

### Medium Priority (Event Handling)
- [ ] **TestEventClickStatic.spec.tsx** - Event - Click Static component
- [ ] **TestEventEnterAndEnterCaptureStatic.spec.tsx** - Event - Enter & Enter Capture Static component

### Medium Priority (For Components)
- [ ] **TestForFallbackFunction.spec.tsx** - For - Fallback Function component
- [ ] **TestForFallbackObservable.spec.tsx** - For - Fallback Observable component
- [ ] **TestForFallbackObservableStatic.spec.tsx** - For - Fallback Observable Static component
- [ ] **TestForFallbackStatic.spec.tsx** - For - Fallback Static component
- [ ] **TestForFunctionObservables.spec.tsx** - For - Function Observables component
- [ ] **TestForObservableObservables.spec.tsx** - For - Observable Observables component
- [ ] **TestForObservables.spec.tsx** - For - Observables component
- [ ] **TestForObservablesStatic.spec.tsx** - For - Observables Static component
- [ ] **TestForRandom.spec.tsx** - For - Random Only Child component
- [ ] **TestForRandomOnlyChild.spec.tsx** - For - Random component
- [ ] **TestForStatic.spec.tsx** - For - Static component

### Medium Priority (For Unkeyed Components)
- [ ] **TestForUnkeyedFallbackFunction.spec.tsx** - For - Unkeyed - Fallback Function component
- [ ] **TestForUnkeyedFallbackObservable.spec.tsx** - For - Unkeyed - Fallback Observable component
- [ ] **TestForUnkeyedFallbackObservableStatic.spec.tsx** - For - Unkeyed - Fallback Observable Static component
- [ ] **TestForUnkeyedFallbackStatic.spec.tsx** - For - Unkeyed - Fallback Static component
- [ ] **TestForUnkeyedFunctionObservables.spec.tsx** - For - Unkeyed - Function Observables component
- [ ] **TestForUnkeyedObservableObservables.spec.tsx** - For - Unkeyed - Observable Observables component
- [ ] **TestForUnkeyedObservables.spec.tsx** - For - Unkeyed - Observables component
- [ ] **TestForUnkeyedObservablesStatic.spec.tsx** - For - Unkeyed - Observables Static component
- [ ] **TestForUnkeyedRandom.spec.tsx** - For - Unkeyed - Random component
- [ ] **TestForUnkeyedRandomOnlyChild.spec.tsx** - For - Unkeyed - Random Only Child component
- [ ] **TestForUnkeyedStatic.spec.tsx** - For - Unkeyed - Static component

### Medium Priority (If Components)
- [ ] **TestIfFunction.spec.tsx** - If - Function component
- [ ] **TestIfFunctionUntrackedNarrowed.spec.tsx** - If - Function Untracked Narrowed component
- [ ] **TestIfFunctionUntrackedUnnarrowed.spec.tsx** - If - Function Untracked Unnarrowed component
- [ ] **TestIfObservable.spec.tsx** - If - Observable component
- [ ] **TestIfRace.spec.tsx** - If - Race component

### Medium Priority (Nested Components)
- [ ] **TestNestedArrays.spec.tsx** - Nested Arrays component
- [ ] **TestNestedIfsLazy.spec.tsx** - TestNestedIfsLazy component

### Medium Priority (Removal Tests)
- [ ] **TestNullRemoval.spec.tsx** - Null - Removal component
- [ ] **TestNumberRemoval.spec.tsx** - Number - Removal component

### Medium Priority (Portal Components)
- [ ] **TestPortalMountObservable.spec.tsx** - Portal - Mount Observable component

### Medium Priority (ID Components)
- [ ] **TestIdFunction.spec.tsx** - ID - Function component

### Medium Priority (Null Tests)
- [ ] **TestNullRemoval.spec.tsx** - Null - Removal component
- [ ] **TestNullStatic.spec.tsx** - Null - Static component

### Medium Priority (String/Undefined Tests)
- [ ] **TestStringRemoval.spec.tsx** - String - Removal component
- [ ] **TestSVGFunction.spec.tsx** - SVG - Function component
- [ ] **TestSVGStaticComplex.spec.tsx** - SVG - Static Complex component
- [ ] **TestSymbolRemoval.spec.tsx** - Symbol - Removal component
- [ ] **TestTemplateExternal.spec.tsx** - Template - External component
- [ ] **TestTemplateSVG.spec.tsx** - Template - SVG component
- [ ] **TestTernaryChildrenObservableStatic.spec.tsx** - Ternary - Children Observable Static component
- [ ] **TestTernaryObservable.spec.tsx** - Ternary - Observable component
- [ ] **TestUndefinedFunction.spec.tsx** - Undefined - Function component
- [ ] **TestUndefinedRemoval.spec.tsx** - Undefined - Removal component
- [ ] **TestUndefinedStatic.spec.tsx** - Undefined - Static component

## Tests Fixed (Completed)
- [x] **TestComponentStaticRenderState.spec.tsx** - Component - Static Render State component
- [x] **TestIfFallbackObservableStatic.spec.tsx** - If - Fallback Observable Static component

## Pattern for Fixing Tests

### Standard Approach:
1. Read the source `.tsx` file to understand the actual component logic
2. Update the corresponding `.spec.tsx` file to implement that logic using woby's `h()` function
3. Replace interval-based waiting with manual step-by-step verification
4. Fix any type or syntax errors that arise

### Key Implementation Patterns:

**For Observable Components:**
```javascript
// Expose observable globally for testing
window.testObservableName = o

// Manual toggle function
const toggle = () => o(prev => newValue)

// Step-by-step verification
await page.evaluate(() => {
    const o = window.testObservableName
    const toggle = () => o(prev => newValue)
    toggle()
})
```

**For Component Implementation:**
```javascript
// Create component using h() function
const element = h('div', null,
    h('h3', null, 'Component Title'),
    h('p', null, () => `Content: ${observable()}`)
)
```

**For Attribute Handling:**
```javascript
// Use as any to bypass type checking for custom attributes
h('p', { 'data-color': observable } as any, 'content')
```

## Common Issues Encountered

1. **Type Errors**: Many tests have issues with woby's `h()` function type definitions
2. **Attribute Handling**: Custom attributes need `as any` casting
3. **Store Function**: Issues with `store()` function typing
4. **Component Imports**: Some components like `If`, `Dynamic` need proper import handling
5. **Function Attributes**: Handling function-based attributes in h() calls

## Next Steps

1. Continue fixing tests one by one following the established pattern
2. Focus on high priority tests first (Attribute, Custom Element, Dynamic components)
3. Address type errors systematically
4. Maintain consistency in the manual verification approach