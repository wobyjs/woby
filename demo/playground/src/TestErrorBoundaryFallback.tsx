import { $, $$, ErrorBoundary, renderToString } from 'woby'
import { TestSnapshots, registerTestObservable, testObservables, assert } from './util'

const TestErrorBoundaryFallback = (): JSX.Element => {
    const ErroringComponent = (): JSX.Element => {
        throw new Error()
    }

    const FallbackComponent = ({ error }): JSX.Element => {
        return <p>Fallback: {error.message}</p>
    }

    const ret: JSX.Element = () => (
        <>
            <h3>Error Boundary - Fallback Test</h3>
            <ErrorBoundary fallback={FallbackComponent}>
                <ErroringComponent />
            </ErrorBoundary>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestErrorBoundaryFallback_ssr', ret)

    return ret
}

TestErrorBoundaryFallback.test = {
    static: true,
    expect: () => {
        // Define expected values for both main test and SSR test
        const expectedFull = '<h3>Error Boundary - Fallback Test</h3><p>Fallback: Error</p>'  // For SSR comparison
        const expected = '<p>Fallback: Error</p>'   // For main test comparison

        const ssrComponent = testObservables['TestErrorBoundaryFallback_ssr']
        const ssrResult = renderToString(ssrComponent)
        if (ssrResult !== expectedFull) {
            assert(false, `[TestErrorBoundaryFallback] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestErrorBoundaryFallback] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}

export default () => <TestSnapshots Component={TestErrorBoundaryFallback} />