import { $, $$, ErrorBoundary, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, random, assert } from './util'

const name = 'TestErrorBoundaryChildrenFunction'
const TestErrorBoundaryChildrenFunction = (): JSX.Element => {
    const childrenValue = String(random())
    const childrenObservable = $(childrenValue)
    registerTestObservable('TestErrorBoundaryChildrenFunction', childrenObservable)
    const name = 'Children'
    const Children = (): JSX.Element => {
        // Remove the dynamic updating to make this truly static
        // const o = $(String(random()))
        // const randomize = () => o(String(random()))
        // useInterval(randomize, TEST_INTERVAL)
        // o()
        return <p>Children: {childrenValue}</p>
    }
    const name = 'Fallback'
    const Fallback = (): JSX.Element => {
        return <p>Fallback!</p>
    }
    const ret: JSX.Element = () => (
        <>
            <h3>Error Boundary - Children Function</h3>
            <ErrorBoundary fallback={<Fallback />}>
                {Children}
            </ErrorBoundary>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestErrorBoundaryChildrenFunction_ssr', ret)

    return ret
}

TestErrorBoundaryChildrenFunction.test = {
    static: true,
    expect: () => {
        const value = $$(testObservables['TestErrorBoundaryChildrenFunction'])

        // Define expected values for both main test and SSR test
        const expectedFull = `<h3>Error Boundary - Children Function</h3><p>Children: ${value}</p>`  // For SSR comparison
        const expected = `<p>Children: ${value}</p>`   // For main test comparison

        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        if (ssrResult !== expectedFull) {
            assert(false, `${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ ${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestErrorBoundaryChildrenFunction} />