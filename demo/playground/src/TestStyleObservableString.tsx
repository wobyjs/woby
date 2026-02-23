import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestStyleObservableString = (): JSX.Element => {
    const o = $('color: green')
    registerTestObservable('TestStyleObservableString', o)
    const toggle = () => o(prev => (prev === 'color: green') ? 'color: orange' : 'color: green')
    useInterval(toggle, TEST_INTERVAL)
    const ret: JSX.Element = (
        <>
            <h3>Style - Observable String</h3>
            <p style={o}>content</p>
        </>
    )
    
    // Store the component for SSR testing
    registerTestObservable('TestStyleObservableString_ssr', ret)
    
    return ret
}

TestStyleObservableString.test = {
    static: false,
    expect: () => {
        const value = $$(testObservables['TestStyleObservableString'])
        const expected = `<p style="${value}">content</p>`
        
        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestStyleObservableString_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    const expectedFull = `<h3>Style - Observable String</h3><p style="${value}">content</p>`
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


export default () => <TestSnapshots Component={TestStyleObservableString} />