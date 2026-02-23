import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestStyleStaticString = (): JSX.Element => {
    const ret: JSX.Element = (
        <>
            <h3>Style - Static String</h3>
            <p style="flex-grow: 1; height: 50px;">content</p>
        </>
    )
    
    // Store the component for SSR testing
    registerTestObservable('TestStyleStaticString_ssr', ret)
    
    return ret
}

TestStyleStaticString.test = {
    static: true,
    expect: () => {
        const expected = '<p style="flex-grow: 1; height: 50px;">content</p>'
        
        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestStyleStaticString_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    const expectedFull = '<h3>Style - Static String</h3><p style="flex-grow: 1; height: 50px;">content</p>'
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


export default () => <TestSnapshots Component={TestStyleStaticString} />