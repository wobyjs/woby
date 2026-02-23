import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, random, assert } from './util'

const TestComponentObservableDirect = (): JSX.Element => {
    const getRandom = (): number => random()
    const o = $(getRandom())
    registerTestObservable('TestComponentObservableDirect', o)
    const randomize = () => o(getRandom())
    useInterval(randomize, TEST_INTERVAL)

    const ret: JSX.Element = (
        <>
            <h3>Component - Observable Direct</h3>
            <p>{o}</p>
        </>
    )
    
    // Store the component for SSR testing
    registerTestObservable('TestComponentObservableDirect_ssr', ret)
    
    return ret
}

TestComponentObservableDirect.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const value = $$(testObservables['TestComponentObservableDirect'])
        
        // Define expected values for both main test and SSR test
        const expectedFull = `<h3>Component - Observable Direct</h3><p>${value}</p>`  // For SSR comparison
        const expected = `<p>${value}</p>`   // For main test comparison
        
        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestComponentObservableDirect_ssr']
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



export default () => <TestSnapshots Component={TestComponentObservableDirect} />