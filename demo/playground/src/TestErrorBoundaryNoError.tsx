import { $, $$, ErrorBoundary, renderToString } from 'woby'
import { TestSnapshots, registerTestObservable, testObservables, assert } from './util'

const TestErrorBoundaryNoError = (): JSX.Element => {
    const ErroringComponent = (): JSX.Element => {
        return <p>Normal content</p>
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
    registerTestObservable('TestErrorBoundaryNoError_ssr', ret)

    return ret
}

TestErrorBoundaryNoError.test = {
    static: true,
    expect: () => {
        // Define expected values for both main test and SSR test
        const expectedFull = '<h3>Error Boundary - Fallback Test</h3><p>Normal content</p>'  // For SSR comparison
        const expected = '<p>Normal content</p>'   // For main test comparison

        const ssrComponent = testObservables['TestErrorBoundaryNoError_ssr']
        const ssrResult = renderToString(ssrComponent)
        if (ssrResult !== expectedFull) {
            assert(false, `[TestErrorBoundaryNoError] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestErrorBoundaryNoError] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}

export default () => <TestSnapshots Component={TestErrorBoundaryNoError} />