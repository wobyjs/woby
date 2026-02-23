import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestSimpleExpect = (): JSX.Element => {
    const value = $("Hello World")
    // Store the observable globally so the test can access it
    registerTestObservable('TestSimpleExpect', value)
    const ret: JSX.Element = (
        <>
            <h3>Simple Expect Test</h3>
            <p>{value}</p>
        </>
    )
    
    // Store the component for SSR testing - only in environments where function is available
    if (typeof registerTestObservable !== 'undefined') {
        registerTestObservable('TestSimpleExpect_ssr', ret)
    }
    
    return ret
}

TestSimpleExpect.test = {
    static: true,
    compareActualValues: true,
    expect: () => {
        const value = $$(testObservables['TestSimpleExpect'])
        const expected = `<p>${value}</p>`
        
        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestSimpleExpect_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    const expectedFull = '<h3>Simple Expect Test</h3><p>Hello World</p>'
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


export default () => <TestSnapshots Component={TestSimpleExpect} />