import { $, $$, renderToString } from 'woby'
import { TestSnapshots, registerTestObservable, testObservables, assert } from './util'

const TestEventClickCaptureStatic = (): JSX.Element => {
    const o = $(0)
    registerTestObservable('TestEventClickCaptureStatic_o', o)
    const increment = () => o(prev => prev + 1)

    const ret: JSX.Element = (
        <>
            <h3>Event - Click Capture Static</h3>
            <p><button onClickCapture={increment}>{o}</button></p>
        </>
    )
    
    // Store the component for SSR testing
    registerTestObservable('TestEventClickCaptureStatic_ssr', ret)
    
    return ret
}


TestEventClickCaptureStatic.test = {
    static: true,
    expect: () => {
        const value = testObservables['TestEventClickCaptureStatic_o']?.() ?? 0
        
        // Define expected values for both main test and SSR test
        const expectedFull = `<h3>Event - Click Capture Static</h3><p><button>${value}</button></p>`  // For SSR comparison
        const expected = `<p><button>${value}</button></p>`   // For main test comparison
        
        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestEventClickCaptureStatic_ssr']
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

export default () => <TestSnapshots Component={TestEventClickCaptureStatic} />