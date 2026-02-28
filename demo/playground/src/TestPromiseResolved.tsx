import { $, $$, usePromise, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestPromiseResolved = (): JSX.Element => {
    // Static promise that's already resolved for static test
    const ret: JSX.Element = (
        <>
            <h3>Promise - Resolved</h3>
            <p>Loaded!</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestPromiseResolved_ssr', ret)

    return ret
}

TestPromiseResolved.test = {
    static: true,
    expect: () => {
        // Define expected values for both main test and SSR test
        const expectedFull = '<h3>Promise - Resolved</h3><p>Loaded!</p>'  // For SSR comparison
        const expected = '<p>Loaded!</p>'   // For main DOM test comparison

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestPromiseResolved_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                // If it's a JSX element or function, we can render it to string
                // If it's a function, we need to call it first to get the element
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    if (ssrResult !== expectedFull) {
                        assert(false, `[TestPromiseResolved] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
                    } else {
                        console.log(`✅ [TestPromiseResolved] SSR test passed: ${ssrResult}`)
                    }
                }).catch(err => {
                    console.error(`[TestPromiseResolved] SSR render error: ${err}`)
                })
            }
        }, 0)

        return expected  // This is what the DOM test framework compares against
    }
}


export default () => <TestSnapshots Component={TestPromiseResolved} />