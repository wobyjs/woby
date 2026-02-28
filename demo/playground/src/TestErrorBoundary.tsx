import { $, $$, useMemo, ErrorBoundary, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, useTimeout, assert } from './util'

const TestErrorBoundary = (): JSX.Element => {
    const Erroring = (): JSX.Element => {
        // Immediately throw error for predictable test
        throw new Error('Custom error')
    }
    const Fallback = ({ error }): JSX.Element => {
        return <p>Error caught: {error.message}</p>
    }
    const ret: JSX.Element = (
        <>
            <h3>Error Boundary</h3>
            <ErrorBoundary fallback={Fallback}>
                <Erroring />
            </ErrorBoundary>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestErrorBoundary_ssr', ret)

    return ret
}

TestErrorBoundary.test = {
    static: true,
    compareActualValues: true,
    expect: () => {
        // Define expected values for both main test and SSR test
        const expectedFull = '<h3>Error Boundary</h3><p>Error caught: Custom error</p>'  // For SSR comparison
        const expected = '<p>Error caught: Custom error</p>'   // For main test comparison

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestErrorBoundary_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                // If it's a JSX element or function, we can render it to string
                // If it's a function, we need to call it first to get the element
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    if (ssrResult !== expectedFull) {
                        assert(false, `[TestErrorBoundary] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
                    } else {
                        console.log(`✅ [TestErrorBoundary] SSR test passed: ${ssrResult}`)
                    }
                }).catch(err => {
                    console.error(`[TestErrorBoundary] SSR render error: ${err}`)
                })
            }
        }, 0)

        return expected
    }
}


export default () => <TestSnapshots Component={TestErrorBoundary} />