import { $, $$, If, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const name = 'TestIfNestedFunctionNarrowed'
const TestIfNestedFunctionNarrowed = (): JSX.Element => {
    // Static value for static test
    const ret: JSX.Element = () => (
        <>
            <h3>If - Nested Function Narrowed</h3>
            <p>(<If when={true}>{value => 0}</If>)</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}


// Conditional: SSR tests (Node.js environment - tsx mode)
if (typeof window === 'undefined') {
    TestIfNestedFunctionNarrowed()
    const ssrComponent = testObservables[`TestIfNestedFunctionNarrowed_ssr`]
    if (ssrComponent) {
        const ssrResult = renderToString(ssrComponent)
        console.log(`\n📝 Test: TestIfNestedFunctionNarrowed\n   SSR: ${ssrResult} ✅\n`)
    }
}

TestIfNestedFunctionNarrowed.test = {
    static: true,
    expect: () => {
        // Define expected values for both main test and SSR test
        const expectedFull = '<h3>If - Nested Function Narrowed</h3><p>(0)</p>'  // For SSR comparison
        const expected = '<p>(0)</p>'   // For main DOM test comparison

        // Test the SSR value synchronously
        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        if (ssrResult !== expectedFull) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [${name}] SSR test passed: ${ssrResult}`)
        }

        return expected  // This is what the DOM test framework compares against
    }
}


export default () => <TestSnapshots Component={TestIfNestedFunctionNarrowed} />