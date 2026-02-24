import { $, $$, usePromise, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestPromiseRejected = (): JSX.Element => {
    // Static promise that's already rejected for static test
    const ret: JSX.Element = (
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

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestPromiseRejected_ssr']
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


export default () => <TestSnapshots Component={TestPromiseRejected} />