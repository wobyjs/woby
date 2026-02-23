import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestRefUnmounting = (): JSX.Element => {
    const message = $('No ref') // Static value
    const ret: JSX.Element = (
        <>
            <h3>Ref - Unmounting</h3>
            <p>{message}</p>
            <p>content</p> {/* Static content, not conditional */}
        </>
    )
    
    // Store the component for SSR testing
    registerTestObservable('TestRefUnmounting_ssr', ret)
    
    return ret
}

TestRefUnmounting.test = {
    static: true,
    wrap: false,
    expect: () => {
        const expected = '<p>No ref</p><p>content</p> '
        
        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestRefUnmounting_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    const expectedFull = '<h3>Ref - Unmounting</h3><p>No ref</p><p>content</p> '
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


export default () => <TestSnapshots Component={TestRefUnmounting} />