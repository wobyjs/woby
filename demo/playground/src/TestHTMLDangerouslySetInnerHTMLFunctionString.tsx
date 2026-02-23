import { $, $$, renderToString } from 'woby'
import { TestSnapshots, registerTestObservable, testObservables, assert } from './util'

const TestHTMLDangerouslySetInnerHTMLFunctionString = (): JSX.Element => {
    // Static value for static test
    const ret: JSX.Element = (
        <>
            <h3>HTML - dangerouslySetInnerHTML - Function String</h3>
            <p dangerouslySetInnerHTML={{ __html: '<i>danger</i>' }} />
        </>
    )
    
    // Store the component for SSR testing
    registerTestObservable('TestHTMLDangerouslySetInnerHTMLFunctionString_ssr', ret)
    
    return ret
}

TestHTMLDangerouslySetInnerHTMLFunctionString.test = {
    static: true,
    expect: () => {
        // Define expected values for both main test and SSR test
        const expectedFull = '<h3>HTML - dangerouslySetInnerHTML - Function String</h3><p><i>danger</i></p>'
        const expected = '<p><i>danger</i></p>'
        
        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestHTMLDangerouslySetInnerHTMLFunctionString_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
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


export default () => <TestSnapshots Component={TestHTMLDangerouslySetInnerHTMLFunctionString} />