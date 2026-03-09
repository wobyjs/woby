import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestPropertyValueStatic = (): JSX.Element => {
    const ret: JSX.Element = () => (
        <>
            <h3>Property - Value Static</h3>
            <p><input value="value" /></p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestPropertyValueStatic_ssr', ret)

    return ret
}

TestPropertyValueStatic.test = {
    static: true,
    expect: () => {
        // Define expected values for both main test and SSR test
        const expectedFull = '<h3>Property - Value Static</h3><p><input value="value" /></p>'  // For SSR comparison
        const expected = '<p><input></p>'   // For main DOM test comparison

        const ssrComponent = testObservables['TestPropertyValueStatic_ssr']
        const ssrResult = renderToString(ssrComponent)
        if (ssrResult !== expectedFull) {
            assert(false, `[TestPropertyValueStatic] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [TestPropertyValueStatic] SSR test passed: ${ssrResult}`)
        }

        return expected  // This is what the DOM test framework compares against
    }
}

export default () => <TestSnapshots Component={TestPropertyValueStatic} />
