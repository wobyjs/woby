import { $, $$, renderToString } from 'woby'
import { TestSnapshots, random, registerTestObservable, testObservables, assert } from './util'

const TestInputLabelFor = (): JSX.Element => {
    const ret: JSX.Element = () => (
        <>
            <h3>Input - Label For</h3>
            <p><label htmlFor="for-target">htmlFor</label></p>
            <p><label for="for-target">for</label></p>
            <p><input id="for-target" /></p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestInputLabelFor_ssr', ret)

    return ret
}

TestInputLabelFor.test = {
    static: true,
    expect: () => {
        // Define expected values for both main test and SSR test
        const expectedFull = '<h3>Input - Label For</h3><p><label htmlFor="for-target">htmlFor</label></p><p><label for="for-target">for</label></p><p><input id="for-target"></input></p>'  // For SSR comparison
        const expected = '<p><label for="for-target">htmlFor</label></p><p><label for="for-target">for</label></p><p><input id="for-target"></p>'   // For main DOM test comparison

        // Test the SSR value synchronously
        const ssrComponent = testObservables['TestInputLabelFor_ssr']
        const ssrResult = renderToString(ssrComponent)
        if (ssrResult !== expectedFull) {
            assert(false, `[TestInputLabelFor] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestInputLabelFor] SSR test passed: ${ssrResult}`)
        }

        return expected  // This is what the DOM test framework compares against
    }
}

export default () => <TestSnapshots Component={TestInputLabelFor} />