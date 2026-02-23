import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestStylesStore = (): JSX.Element => {
    const styles = { color: 'orange', fontWeight: 'normal' }  // Static value
    const ret: JSX.Element = (
        <>
            <h3>Styles - Store</h3>
            <p style={styles}>content</p>
        </>
    )
    
    // Store the component for SSR testing
    registerTestObservable('TestStylesStore_ssr', ret)
    
    return ret
}

TestStylesStore.test = {
    static: true,
    expect: () => {
        const expected = '<p style="color: orange; font-weight: normal;">content</p>'
        
        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestStylesStore_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    const expectedFull = '<h3>Styles - Store</h3><p style="color: orange; font-weight: normal;">content</p>'
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


export default () => <TestSnapshots Component={TestStylesStore} />