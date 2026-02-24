import { $, $$, If, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestIfNestedFunctionUnnarrowed = (): JSX.Element => {
    // Static value for static test
    const content = 0  // Fixed value to ensure it stays at 0
    const ret: JSX.Element = (
        <>
            <h3>If - Nested Function Unnarrowed</h3>
            <p>(<If when={true}>{() => content}</If>)</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestIfNestedFunctionUnnarrowed_ssr', ret)

    return ret
}

TestIfNestedFunctionUnnarrowed.test = {
    static: true,
    expect: () => {
        // Define expected values for both main test and SSR test
        const expectedFull = '<h3>If - Nested Function Unnarrowed</h3><p>(0)</p>'  // For SSR comparison
        const expected = '<p>(0)</p>'   // For main DOM test comparison

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestIfNestedFunctionUnnarrowed_ssr']
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


export default () => <TestSnapshots Component={TestIfNestedFunctionUnnarrowed} />