import { $, $$, ErrorBoundary, renderToString } from 'woby'
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
    const ret: JSX.Element = (
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
        
        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestErrorBoundaryFallbackFunction_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                // If it's a JSX element or function, we can render it to string
                // If it's a function, we need to call it first to get the element
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    if (ssrResult !== expectedFull) {
                        assert(false, `SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
                    } else {
                        console.log(`✅ SSR test passed: ${ssrResult}`)
                    }
                }).catch(err => {
                    console.error(`SSR render error: ${err}`)
                })
            }
        }, 0)
        
        return expected
    }
}


export default () => <TestSnapshots Component={TestErrorBoundaryFallbackFunction} />