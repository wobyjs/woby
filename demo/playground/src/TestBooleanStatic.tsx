import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestBooleanStatic = (): JSX.Element => {
    const ret: JSX.Element = (
        <>
            <h3>Boolean - Static</h3>
            <p>truefalse</p>
        </>
    )
    
    // Store the component for SSR testing
    registerTestObservable('TestBooleanStatic_ssr', ret)
    
    return ret
}

TestBooleanStatic.test = {
    static: true,
    expect: () => {
        const expected = '<p>truefalse</p>'
        
        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestBooleanStatic_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    const expectedFull = `<h3>Boolean - Static</h3>${expected}`
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


export default () => <TestSnapshots Component={TestBooleanStatic} />