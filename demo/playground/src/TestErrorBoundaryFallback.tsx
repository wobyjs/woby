import { $, $$, ErrorBoundary, renderToString, type JSX } from 'woby'
import { TestSnapshots, registerTestObservable, testObservables, assert, runSSRTest } from './util'

const name = 'TestErrorBoundaryFallback'
const TestErrorBoundaryFallback = (): JSX.Element => {
    // NOTE: no local `name` here — it would shadow the module-level one and make the
    // registration below land under the wrong key, so expect() would render undefined.
    const ErroringComponent = (): JSX.Element => {
        // The message is what the fallback renders, so it has to be non-empty.
        throw new Error('Error')
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

// SSR assertions, driven on the same schedule the browser's <TestSnapshots> uses.
if (typeof window === 'undefined') runSSRTest(name, TestErrorBoundaryFallback)
