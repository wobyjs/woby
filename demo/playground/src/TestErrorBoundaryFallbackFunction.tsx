import { $, $$, ErrorBoundary, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, random, assert } from './util'

const TestErrorBoundaryFallbackFunction = (): JSX.Element => {
    const Children = (): JSX.Element => {
        throw new Error()
    }
    const fallbackValue = String(random())
    registerTestObservable('TestErrorBoundaryFallbackFunction', $(fallbackValue))
    const Fallback = (): JSX.Element => {
        // Remove dynamic updating for static test
        // const o = $(String(random()))
        // const randomize = () => o(String(random()))
        // useInterval(randomize, TEST_INTERVAL)
        // o()
        return <p>Fallback: {fallbackValue}</p>
    }
    const ret: JSX.Element = () => (
        <>
            <h3>Error Boundary - Fallback Function</h3>
            <ErrorBoundary fallback={Fallback}>
                <Children />
            </ErrorBoundary>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestErrorBoundaryFallbackFunction_ssr', ret)

    return ret
}

TestErrorBoundaryFallbackFunction.test = {
    static: true,
    compareActualValues: true,
    expect: () => {
        const fallbackValue = $$(testObservables['TestErrorBoundaryFallbackFunction'])

        // Define expected values for both main test and SSR test
        const expectedFull = `<h3>Error Boundary - Fallback Function</h3><p>Fallback: ${fallbackValue}</p>`  // For SSR comparison
        const expected = `<p>Fallback: ${fallbackValue}</p>`   // For main test comparison

        const ssrComponent = testObservables['TestErrorBoundaryFallbackFunction_ssr']
        const ssrResult = renderToString(ssrComponent)
        if (ssrResult !== expectedFull) {
            assert(false, `[TestErrorBoundaryFallbackFunction] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [TestErrorBoundaryFallbackFunction] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestErrorBoundaryFallbackFunction} />