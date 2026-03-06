import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestPropertyCheckedRemoval = (): JSX.Element => {
    // Static value for static test - set to true to have checked attribute
    const ret: JSX.Element = () => (
        <>
            <h3>Property - Checked Removal</h3>
            <p><input type="checkbox" checked={true} /></p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestPropertyCheckedRemoval_ssr', ret)

    return ret
}

TestPropertyCheckedRemoval.test = {
    static: true,
    expect: () => {
        // Define expected values for both main test and SSR test
        const expectedFull = '<h3>Property - Checked Removal</h3><p><input type="checkbox" checked=""></input></p>'  // For SSR comparison
        const expected = '<p><input type="checkbox"></p>'   // For main DOM test comparison

        // Test the SSR value synchronously
        const ssrComponent = testObservables['TestPropertyCheckedRemoval_ssr']
        const ssrResult = renderToString(ssrComponent)
        if (ssrResult !== expectedFull) {
            assert(false, `[TestPropertyCheckedRemoval] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestPropertyCheckedRemoval] SSR test passed: ${ssrResult}`)
        }

        return expected  // This is what the DOM test framework compares against
    }
}


export default () => <TestSnapshots Component={TestPropertyCheckedRemoval} />