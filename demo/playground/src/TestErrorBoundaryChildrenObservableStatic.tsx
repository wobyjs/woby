import { $, $$, ErrorBoundary, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, random, assert } from './util'

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
    const ret: JSX.Element = (
        <>
            <h3>Error Boundary - Children Observable Static</h3>
            <ErrorBoundary fallback={<Fallback />}>
                <Children />
            </ErrorBoundary>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestErrorBoundaryChildrenObservableStatic_ssr', ret)

    return ret
}

TestErrorBoundaryChildrenObservableStatic.test = {
    static: true,
    compareActualValues: true,
    expect: () => {
        const childrenValue = $$(testObservables['TestErrorBoundaryChildrenObservableStatic'])

        // Define expected values for both main test and SSR test
        const expectedFull = `<h3>Error Boundary - Children Observable Static</h3><p>Children: ${childrenValue}</p>`  // For SSR comparison
        const expected = `<p>Children: ${childrenValue}</p>`   // For main test comparison

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestErrorBoundaryChildrenObservableStatic_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                // If it's a JSX element or function, we can render it to string
                // If it's a function, we need to call it first to get the element
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    if (ssrResult !== expectedFull) {
                        assert(false, `[TestErrorBoundaryChildrenObservableStatic] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
                    } else {
                        console.log(`✅ [TestErrorBoundaryChildrenObservableStatic] SSR test passed: ${ssrResult}`)
                    }
                }).catch(err => {
                    console.error(`[TestErrorBoundaryChildrenObservableStatic] SSR render error: ${err}`)
                })
            }
        }, 0)

        return expected
    }
}


export default () => <TestSnapshots Component={TestErrorBoundaryChildrenObservableStatic} />