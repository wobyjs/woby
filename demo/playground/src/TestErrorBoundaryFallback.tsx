import { $, $$, ErrorBoundary, renderToString, type JSX } from 'woby'
import { TestSnapshots, registerTestObservable, testObservables, assert } from './util'

const name = 'TestErrorBoundaryFallback'
const TestErrorBoundaryFallback = (): JSX.Element => {
    const name = 'ErroringComponent'
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
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}


// Conditional: SSR tests (Node.js environment - tsx mode)
if (typeof window === 'undefined') {
    const ret = TestErrorBoundaryFallback()
    const ssrResult = renderToString(ret)
    console.log(`\n📝 Test: TestErrorBoundaryFallback\n   SSR: ${ssrResult} ✅\n`)
}

TestErrorBoundaryFallback.test = {
    static: true,
    expect: () => {
        // Define expected values for both main test and SSR test
        const expectedFull = '<h3>Error Boundary - Fallback Test</h3><p>Fallback: Error</p>'  // For SSR comparison
        const expected = '<p>Fallback: Error</p>'   // For main test comparison

        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        if (ssrResult !== expectedFull) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}

export default () => <TestSnapshots Component={TestErrorBoundaryFallback} />