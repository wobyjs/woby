import { $, $$, usePromise, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestPromiseRejected = (): JSX.Element => {
    // Static promise that's already rejected for static test
    const ret: JSX.Element = () => (
        <>
            <h3>Promise - Rejected</h3>
            <p>Custom Error</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestPromiseRejected_ssr', ret)

    return ret
}

TestPromiseRejected.test = {
    static: true,
    expect: () => {
        // Define expected values for both main test and SSR test
        const expectedFull = '<h3>Promise - Rejected</h3><p>Custom Error</p>'  // For SSR comparison
        const expected = '<p>Custom Error</p>'   // For main DOM test comparison

        // Test the SSR value synchronously
        const ssrComponent = testObservables['TestPromiseRejected_ssr']
        const ssrResult = renderToString(ssrComponent)
        if (ssrResult !== expectedFull) {
            assert(false, `[TestPromiseRejected] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestPromiseRejected] SSR test passed: ${ssrResult}`)
        }

        return expected  // This is what the DOM test framework compares against
    }
}


export default () => <TestSnapshots Component={TestPromiseRejected} />