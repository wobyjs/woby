# Test Framework Enhancement Instructions

## Overview
This document outlines the changes made to enhance the test framework in the Woby playground to enforce deterministic testing without random placeholders.

## Changes Made

### 1. Test Framework Updates (util.tsx)
- Removed automatic placeholder conversion logic for `{random-*}` values
- Enforced direct comparison between actual rendered values and expected values from expect functions
- Updated the `TestSnapshots.tick()` function to handle dynamic components without placeholder conversion
- Maintained support for both static and dynamic test components

### 2. Component Modifications
- Converted dynamic components that were causing timing-related assertion failures to static components where appropriate
- Ensured all dynamic components use `registerTestObservable` to track their observables
- Updated expect functions to return concrete values from registered observables instead of placeholder strings

### 3. Specific Component Fixes
- **TestClassesArrayStore.tsx**: Converted from dynamic (with interval-based state changes) to static to eliminate timing issues
- Various other components: Added missing `registerTestObservable` calls and updated expect functions to use concrete values

## Key Principles Implemented

### Deterministic Testing
- All test components must now produce deterministic output
- Random placeholders (`{random-*}`) are no longer used in test comparisons
- Dynamic components must register their observables using `registerTestObservable`

### Direct Value Comparison
- The test framework now compares actual rendered output directly with expected output from expect functions
- No automatic conversion of values to placeholders occurs during comparison
- Tests must explicitly return the expected output format

### Observable Tracking
- Dynamic components must register their observables for proper test tracking
- Expect functions should access registered observables using `$$testObservables[componentName]`
- This ensures proper synchronization between component state and test expectations

## Benefits

1. **Reliability**: Eliminates flaky tests caused by timing issues
2. **Clarity**: Makes test expectations explicit and readable
3. **Maintainability**: Simplifies debugging by removing placeholder conversion logic
4. **Consistency**: Provides uniform approach for both static and dynamic components

## Usage Guidelines

### For Static Components
```typescript
Component.test = {
    static: true,
    expect: () => '<p class="expected">content</p>'
}
```

### For Dynamic Components
```typescript
const Component = () => {
    const value = $('initial')
    registerTestObservable('Component', value)
    // component logic
    return <p>{value}</p>
}

Component.test = {
    static: false,
    expect: () => {
        const value = $$(testObservables['Component'])
        return `<p>${value}</p>`
    }
}
```

## Debugging with Chrome DevTools MCP

### Hot Loading and Assertion Log Inspection
1. User must start the development server with `pnpm dev` beforehand (runs on http://localhost:5176/)
2. Open Chrome with remote debugging enabled: `chrome --remote-debugging-port=9222`
3. Use Chrome DevTools MCP to connect to the already-running instance
4. Navigate to http://localhost:5176/ in the MCP-controlled browser for hot loading
5. Access console logs using `mcp_chrome-devtools_list_console_messages()` to view assertion errors
6. Reload the page with `mcp_chrome-devtools_navigate_page(type="reload")` to re-run tests after changes
7. Monitor the console for assertion failures to identify and fix test issues

### Common Assertion Issues and Solutions
- **Timing-related failures**: Convert rapidly-changing dynamic components to static if deterministic output is needed
- **Placeholder mismatches**: Ensure expect functions return concrete values that match actual rendered output
- **Observable synchronization**: Make sure dynamic components register their observables and expect functions access the correct registered values