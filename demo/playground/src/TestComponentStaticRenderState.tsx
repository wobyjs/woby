import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestComponentStaticRenderState = ({ value = 0 }: { value?: number }): JSX.Element => {
    const multiplier = 0
    const ret: JSX.Element = (
        <>
            <h3>Component - Static Render State</h3>
            <p>{(value || 0) * multiplier}</p>
        </>
    )
    
    // Store the component for SSR testing
    registerTestObservable('TestComponentStaticRenderState_ssr', ret)
    
    return ret
}

TestComponentStaticRenderState.test = {
    static: true,
    expect: () => {
        // Define expected values for both main test and SSR test
        const expectedFull = '<h3>Component - Static Render State</h3><p>0</p>'  // For SSR comparison
        const expected = '<p>0</p>'   // For main test comparison
        
        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestComponentStaticRenderState_ssr']
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




export default () => <TestSnapshots Component={TestComponentStaticRenderState} />