import { $, $$, ErrorBoundary, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, random, assert } from './util'

const name = 'TestErrorBoundaryChildrenObservableStatic'
const TestErrorBoundaryChildrenObservableStatic = (): JSX.Element => {
    const childrenValue = String(random())
    registerTestObservable('TestErrorBoundaryChildrenObservableStatic', $(childrenValue))

    const Children = (): JSX.Element => {
        // Remove dynamic updating for static test
        // const o = $(String(random()))
        // const randomize = () => o(String(random()))
        // useInterval(randomize, TEST_INTERVAL)
        // o()
        return <p>Children: {childrenValue}</p>
    }

    const Fallback = (): JSX.Element => {
        return <p>Fallback!</p>
    }
    const ret: JSX.Element = () => (
        <>
            <h3>Error Boundary - Children Observable Static</h3>
            <ErrorBoundary fallback={<Fallback />}>
                <Children />
            </ErrorBoundary>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}

TestErrorBoundaryChildrenObservableStatic.test = {
    static: true,
    compareActualValues: true,
    expect: () => {
        const childrenValue = $$(testObservables[name])

        // Define expected values for both main test and SSR test
        const expectedFull = `<h3>Error Boundary - Children Observable Static</h3><p>Children: ${childrenValue}</p>`  // For SSR comparison
        const expected = `<p>Children: ${childrenValue}</p>`   // For main test comparison

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


export default () => <TestSnapshots Component={TestErrorBoundaryChildrenObservableStatic} />