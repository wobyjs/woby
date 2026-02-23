import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestStylesMixed = (): JSX.Element => {
    const ret: JSX.Element = (
        <>
            <h3>Styles - Mixed</h3>
            <div style={[{ color: 'red' }, [{ fontStyle: () => 'italic' }]]}>example</div>
        </>
    )
    
    // Store the component for SSR testing
    registerTestObservable('TestStylesMixed_ssr', ret)
    
    return ret
}

TestStylesMixed.test = {
    static: true,
    expect: () => {
        const expected = '<div style="color: red; font-style: italic;">example</div>'
        
        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestStylesMixed_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    const expectedFull = '<h3>Styles - Mixed</h3><div style="color: red; font-style: italic;">example</div>'
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


export default () => <TestSnapshots Component={TestStylesMixed} />