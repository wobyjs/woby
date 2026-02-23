# Adding SSR Tests to Woby Playground Components

This guide outlines the process to add Server-Side Rendering (SSR) tests to components in the `D:\temp\woby\demo\playground\src` directory.

## Prerequisites

1. The `registerTestObservable` function in `util.tsx` must accept JSX elements and functions in addition to observables:

```typescript
export const registerTestObservable = (name: string, value: Observable<any> | JSX.Element | Function) => {
    testObservables[name] = value as any
}
```

## Steps to Add SSR Tests to Components

### 1. Import Required Functions

Ensure the component file imports `renderToString` and `assert`:

```typescript
import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'
```

### 2. Register Component for SSR Testing

In the component function, register the JSX element for SSR testing:

```typescript
const MyComponent = (): JSX.Element => {
    // ... component logic ...
    const ret: JSX.Element = (
        // ... JSX content ...
    )
    
    // Store the component for SSR testing
    registerTestObservable('MyComponent_ssr', ret)
    
    return ret
}
```

### 3. Update the expect Function

Modify the `expect` function in the component's test configuration to include SSR testing. The function returns the expected value for the DOM test, while the SSR test uses its own expected value:

```typescript
MyComponent.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const idx = $$(testObservables['MyComponent'])
        
        // Define expected values for both main test and SSR test
        const fullElements = [
            '<h3>Component Name</h3><p><i>a</i></p>', 
            '<h3>Component Name</h3><p><u>b</u></p>', 
            '<h3>Component Name</h3><p><b>c</b></p>', 
            '<h3>Component Name</h3><p><span>d</span></p>'
        ]
        const partialElements = [
            '<p><i>a</i></p>', 
            '<p><u>b</u></p>', 
            '<p><b>c</b></p>', 
            '<p><span>d</span></p>'
        ]
        
        const expectedFull = fullElements[idx]  // For SSR comparison (expectedFull)
        const expected = partialElements[idx]   // For main DOM test comparison (expected)
        
        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['MyComponent_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                // If it's a JSX element or function, we can render it to string
                // If it's a function, we need to call it first to get the element
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    if (ssrResult !== expectedFull) {
                        assert(false, `SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
                    } else {
                        console.log(`✅ SSR test passed: ${ssrResult}`)
                    }
                }).catch(err => {
                    console.error(`SSR render error: ${err}`)
                })
            }
        }, 0)
        
        return expected  // This is what the DOM test framework compares against
    }
}
```

**Two Kinds of Expectations Explained:**

1. **DOM Test Expectation (`expected`)**: This is the value returned by the expect function and compared by the main test framework to validate the client-side rendered output.

2. **SSR Test Expectation (`expectedFull`)**: This is the expected value used specifically for server-side rendering validation within the asynchronous setTimeout callback.

## Process Multiple Files

To apply these changes to all component files in the directory:

1. Identify all `.tsx` files that define components with test configurations
2. Apply the import changes
3. Register the component for SSR testing
4. Update the expect function with SSR testing logic
5. Adjust expected values according to the component's actual output

## Verification

After implementing SSR tests:

1. Check that the main tests still pass: `✅ Expect function test passed for ComponentName`
2. Verify that SSR tests pass: `✅ SSR test passed: <actual SSR output>`
3. Confirm no syntax errors exist in the files

## Notes

- The `renderToString` function returns a Promise, so SSR testing must be handled asynchronously
- The main test expects may need to be adjusted to match what the test framework compares against
- SSR output includes the full rendered HTML structure
- Use `setTimeout` to schedule SSR tests after the main test completes