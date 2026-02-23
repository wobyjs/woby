import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, random, assert } from './util'

const TestStringRemoval = (): JSX.Element => {
    const o = $<string | null>(String(random()))
    // Store the observable globally so the test can access it
    registerTestObservable('TestStringRemoval', o)
    const randomize = () => o(prev => prev ? null : String(random()))
    useInterval(randomize, TEST_INTERVAL)
    const ret: JSX.Element = (
        <>
            <h3>String - Removal</h3>
            <p>({o})</p>
        </>
    )
    
    // Store the component for SSR testing - only in environments where function is available
    if (typeof registerTestObservable !== 'undefined') {
        registerTestObservable('TestStringRemoval_ssr', ret)
    }
    
    return ret
}

TestStringRemoval.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const val = $$(testObservables['TestStringRemoval'])
        const expected = val !== null ? `<p>(${val})</p>` : '<p>(<!---->)</p>'
        
        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestStringRemoval_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    const expectedFull = val !== null ? 
                        `<h3>String - Removal</h3><p>(${val})</p>` : 
                        '<h3>String - Removal</h3><p>(<!---->)</p>'
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


export default () => <TestSnapshots Component={TestStringRemoval} />