import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, random, registerTestObservable, testObservables, assert } from './util'

const TestPropertyValueObservable = (): JSX.Element => {
    // Static value for static test
    const ret: JSX.Element = () => (
        <>
            <h3>Property - Value Observable</h3>
            <p><input value="0.123456" /></p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestPropertyValueObservable_ssr', ret)

    return ret
}

TestPropertyValueObservable.test = {
    static: true,
    expect: () => {
        // Define expected values for both main test and SSR test
        const expectedFull = '<h3>Property - Value Observable</h3><p><input value="0.123456" /></p>'  // For SSR comparison
        const expected = '<p><input></p>'   // For main DOM test comparison

        // Test the SSR value synchronously
        const ssrComponent = testObservables['TestPropertyValueObservable_ssr']
        const ssrResult = renderToString(ssrComponent)
        if (ssrResult !== expectedFull) {
            assert(false, `[TestPropertyValueObservable] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [TestPropertyValueObservable] SSR test passed: ${ssrResult}`)
        }

        return expected  // This is what the DOM test framework compares against
    }
}

export default () => <TestSnapshots Component={TestPropertyValueObservable} />
