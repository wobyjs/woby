import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestChildrenSymbol = (): JSX.Element => {
    const Custom = ({ children }) => {
        return <p>{typeof children}</p>
    }
    const ret: JSX.Element = (
        <>
            <h3>Children - Boolean</h3>
            <Custom>{Symbol()}</Custom>
        </>
    )
    
    // Store the component for SSR testing
    registerTestObservable('TestChildrenSymbol_ssr', ret)
    
    return ret
}

TestChildrenSymbol.test = {
    static: true,
    expect: () => {
        const expected = '<p>symbol</p>'
        
        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestChildrenSymbol_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    const expectedFull = '<h3>Children - Boolean</h3><p>symbol</p>'
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


export default () => <TestSnapshots Component={TestChildrenSymbol} />