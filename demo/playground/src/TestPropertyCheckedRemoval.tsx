import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const name = 'TestPropertyCheckedRemoval'
const TestPropertyCheckedRemoval = (): JSX.Element => {
    // Static value for static test - set to true to have checked attribute
    const ret: JSX.Element = () => (
        <>
            <h3>Property - Checked Removal</h3>
            <p><input type="checkbox" checked={true} /></p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}


// Conditional: SSR tests (Node.js environment - tsx mode)
if (typeof window === 'undefined') {
    TestPropertyCheckedRemoval()
    const ssrComponent = testObservables[`TestPropertyCheckedRemoval_ssr`]
    if (ssrComponent) {
        const ssrResult = renderToString(ssrComponent)
        console.log(`\n📝 Test: TestPropertyCheckedRemoval\n   SSR: ${ssrResult} ✅\n`)
    }
}

TestPropertyCheckedRemoval.test = {
    static: true,
    expect: () => {
        // Define expected values for both main test and SSR test
        const expectedFull = '<h3>Property - Checked Removal</h3><p><input type="checkbox" checked="" /></p>'  // For SSR comparison
        const expected = '<p><input type="checkbox"></p>'   // For main DOM test comparison

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


export default () => <TestSnapshots Component={TestPropertyCheckedRemoval} />
