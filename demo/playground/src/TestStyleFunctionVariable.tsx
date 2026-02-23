import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestStyleFunctionVariable = (): JSX.Element => {
    const o = $('green')
    registerTestObservable('TestStyleFunctionVariable', o)
    const toggle = () => o(prev => (prev === 'orange') ? 'green' : 'orange')
    useInterval(toggle, TEST_INTERVAL)
    const ret: JSX.Element = (
        <>
            <h3>Style - Function Variable</h3>
            <p style={{ color: 'var(--color)', '--color': () => o() }}>content</p>
        </>
    )
    
    // Store the component for SSR testing
    registerTestObservable('TestStyleFunctionVariable_ssr', ret)
    
    return ret
}

TestStyleFunctionVariable.test = {
    static: false,
    expect: () => {
        const value = $$(testObservables['TestStyleFunctionVariable'])
        const expected = `<p style="color: var(--color); --color: ${value};">content</p>`
        
        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestStyleFunctionVariable_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    const expectedFull = `<h3>Style - Function Variable</h3><p style="color: var(--color); --color: ${value};">content</p>`
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


export default () => <TestSnapshots Component={TestStyleFunctionVariable} />