import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestStylesCleanup = (): JSX.Element => {
    const styles = { color: 'orange', fontWeight: 'bold' }  // Static value
    const ret: JSX.Element = (
        <>
            <h3>Styles - Observable Cleanup</h3>
            <p style={styles}>content</p>
        </>
    )
    
    // Store the component for SSR testing
    registerTestObservable('TestStylesCleanup_ssr', ret)
    
    return ret
}

TestStylesCleanup.test = {
    static: true,
    expect: () => {
        const expected = '<p style="color: orange; font-weight: bold;">content</p>'
        
        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestStylesCleanup_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    const expectedFull = '<h3>Styles - Observable Cleanup</h3><p style="color: orange; font-weight: bold;">content</p>'
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


export default () => <TestSnapshots Component={TestStylesCleanup} />