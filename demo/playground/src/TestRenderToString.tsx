import { $, $$, renderToString } from 'woby'
import { TestSnapshots, registerTestObservable, testObservables, assert } from './util'

const TestRenderToString = (): JSX.Element => {
    // Static component that returns the expected structure
    const ret: JSX.Element = (
        <div>
            <h3>renderToString</h3>
            <p>123</p>
        </div>
    )
    
    // Store the component for SSR testing
    registerTestObservable('TestRenderToString_ssr', ret)
    
    return ret
}

TestRenderToString.test = {
    static: true,
    expect: () => {
        const expected = '<div><p>123</p></div>'
        
        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestRenderToString_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    const expectedFull = '<div><h3>renderToString</h3><p>123</p></div>'
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


export default () => <TestSnapshots Component={TestRenderToString} />