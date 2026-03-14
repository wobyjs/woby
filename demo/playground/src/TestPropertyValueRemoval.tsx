import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const name = 'TestPropertyValueRemoval'
const TestPropertyValueRemoval = (): JSX.Element => {
    // Static value for static test - set to a defined value
    const ret: JSX.Element = () => (
        <>
            <h3>Property - Value Removal</h3>
            <p><input value="test-value" /></p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestPropertyValueRemoval_ssr', ret)

    return ret
}

TestPropertyValueRemoval.test = {
    static: true,
    expect: () => {
        // Define expected values for both main test and SSR test
        const expectedFull = '<h3>Property - Value Removal</h3><p><input value="test-value" /></p>'  // For SSR comparison
        const expected = '<p><input></p>'   // For main DOM test comparison

        // Test the SSR value synchronously
        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        if (ssrResult !== expectedFull) {
            assert(false, `${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ ${name}] SSR test passed: ${ssrResult}`)
        }

        return expected  // This is what the DOM test framework compares against
    }
}


export default () => <TestSnapshots Component={TestPropertyValueRemoval} />
