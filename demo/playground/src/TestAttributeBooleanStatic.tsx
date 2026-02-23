import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestAttributeBooleanStatic = (): JSX.Element => {
    const ret: JSX.Element = (
        <>
            <h3>Attribute Boolan - Static</h3>
            <p disabled={true}>content</p>
            <p disabled={false}>content</p>
        </>
    )
    
    // Store the component for SSR testing
    registerTestObservable('TestAttributeBooleanStatic_ssr', ret)
    
    return ret
}

TestAttributeBooleanStatic.test = {
    static: true,
    expect: () => {
        const expected = '<p disabled="">content</p><p>content</p>'
        
        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestAttributeBooleanStatic_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    const expectedFull = `<h3>Attribute Boolan - Static</h3>${expected}`
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


export default () => <TestSnapshots Component={TestAttributeBooleanStatic} />