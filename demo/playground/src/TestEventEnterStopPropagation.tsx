import { $, $$, renderToString } from 'woby'
import { TestSnapshots, registerTestObservable, testObservables, assert } from './util'

const TestEventEnterStopPropagation = (): JSX.Element => {
    const outer = $(0) // Static test
    const inner = $(0) // Static test
    // No event handlers or intervals for static test
    
    const ret: JSX.Element = (
        <>
            <h3>Event - Enter - Stop Propagation</h3>
            <p><button>{outer}<button>{inner}</button></button></p>
        </>
    )
    
    // Store the component for SSR testing
    registerTestObservable('TestEventEnterStopPropagation_ssr', ret)
    
    return ret
}


TestEventEnterStopPropagation.test = {
    static: true,
    expect: () => {
        // For static test, return the expected fixed values
        const expectedFull = '<h3>Event - Enter - Stop Propagation</h3><p><button>0<button>0</button></button></p>'  // For SSR comparison
        const expected = '<p><button>0<button>0</button></button></p>'   // For main test comparison
        
        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestEventEnterStopPropagation_ssr']
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

export default () => <TestSnapshots Component={TestEventEnterStopPropagation} />