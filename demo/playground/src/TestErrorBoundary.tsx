import { $, $$, useMemo, ErrorBoundary, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, useTimeout, assert } from './util'

const name = 'TestErrorBoundary'
const TestErrorBoundary = (): JSX.Element => {
    const Erroring = (): JSX.Element => {
        // Immediately throw error for predictable test
        throw new Error('Custom error')
    }
    const Fallback = ({ error }): JSX.Element => {
        return <p>Error caught: {error.message}</p>
    }
    const ret: JSX.Element = () => (
        <>
            <h3>Error Boundary</h3>
            <ErrorBoundary fallback={Fallback}>
                <Erroring />
            </ErrorBoundary>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}

TestErrorBoundary.test = {
    static: true,
    compareActualValues: true,
    expect: () => {
        // Define expected values for both main test and SSR test
        const expectedFull = '<h3>Error Boundary</h3><p>Error caught: Custom error</p>'  // For SSR comparison
        const expected = '<p>Error caught: Custom error</p>'   // For main test comparison

        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        if (ssrResult !== expectedFull) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ ${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestErrorBoundary} />