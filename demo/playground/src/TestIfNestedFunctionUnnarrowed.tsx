import { $, $$, If, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const name = 'TestIfNestedFunctionUnnarrowed'
const TestIfNestedFunctionUnnarrowed = (): JSX.Element => {
    // Static value for static test
    const content = 0  // Fixed value to ensure it stays at 0
    const ret: JSX.Element = () => (
        <>
            <h3>If - Nested Function Unnarrowed</h3>
            <p>(<If when={true}>{() => content}</If>)</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}


// Conditional: SSR tests (Node.js environment - tsx mode)
if (typeof window === 'undefined') {
    TestIfNestedFunctionUnnarrowed()
    const ssrComponent = testObservables[`TestIfNestedFunctionUnnarrowed_ssr`]
    if (ssrComponent) {
        const ssrResult = renderToString(ssrComponent)
        console.log(`\n📝 Test: TestIfNestedFunctionUnnarrowed\n   SSR: ${ssrResult} ✅\n`)
    }
}

TestIfNestedFunctionUnnarrowed.test = {
    static: true,
    expect: () => {
        // Define expected values for both main test and SSR test
        const expectedFull = '<h3>If - Nested Function Unnarrowed</h3><p>(0)</p>'  // For SSR comparison
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


export default () => <TestSnapshots Component={TestIfNestedFunctionUnnarrowed} />