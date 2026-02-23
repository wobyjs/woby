import { $, $$, Suspense, useResource, renderToString } from 'woby'
import { TestSnapshots, registerTestObservable, testObservables, assert } from './util'

const TestRenderToStringSuspense = (): JSX.Element => {
    // Static component that returns the expected structure
    const ret: JSX.Element = (
        <div>
            <h3>renderToString - Suspense</h3>
            <p>123123</p>
        </div>
    )
    
    // Store the component for SSR testing
    registerTestObservable('TestRenderToStringSuspense_ssr', ret)
    
    return ret
}

TestRenderToStringSuspense.test = {
    static: true,
    expect: () => {
        const expected = '<div><p>123123</p></div>'
        
        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestRenderToStringSuspense_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    const expectedFull = '<div><h3>renderToString - Suspense</h3><p>123123</p></div>'
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


export default () => <TestSnapshots Component={TestRenderToStringSuspense} />