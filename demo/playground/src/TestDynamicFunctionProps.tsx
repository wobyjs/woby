import { $, $$, Dynamic, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

let testit = true
const TestDynamicFunctionProps = (): JSX.Element => {
    const red = { class: 'red' }
    const blue = { class: 'blue' }
    const props = $(red)
    registerTestObservable('TestDynamicFunctionProps', props)
    const toggle = () => {
        props(prev => prev === red ? blue : red)
        testit = false
    }
    useInterval(toggle, TEST_INTERVAL)
    const ret: JSX.Element = (
        <>
            <h3>Dynamic - Function Props</h3>
            <Dynamic component="h5" props={props}>
                Content
            </Dynamic>
        </>
    )
    
    // Store the component for SSR testing
    registerTestObservable('TestDynamicFunctionProps_ssr', ret)
    
    return ret
}

TestDynamicFunctionProps.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const props = $$(testObservables['TestDynamicFunctionProps'])
        
        // Define expected values for both main test and SSR test
        const expectedFull = `<h3>Dynamic - Function Props</h3><h5 class="${props.class}">Content</h5>`  // For SSR comparison
        const expected = `<h5 class="${props.class}">Content</h5>`   // For main test comparison
        
        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestDynamicFunctionProps_ssr']
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


export default () => <TestSnapshots Component={TestDynamicFunctionProps} />