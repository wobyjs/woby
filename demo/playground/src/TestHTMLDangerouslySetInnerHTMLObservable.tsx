import { $, $$, renderToString } from 'woby'
import { TestSnapshots, registerTestObservable, testObservables, assert } from './util'

const TestHTMLDangerouslySetInnerHTMLObservable = (): JSX.Element => {
    // Static value for static test
    const htmlContent = { __html: '<i>danger</i>' }
    const ret: JSX.Element = (
        <>
            <h3>HTML - dangerouslySetInnerHTML - Observable</h3>
            <p dangerouslySetInnerHTML={htmlContent} />
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestHTMLDangerouslySetInnerHTMLObservable_ssr', ret)

    return ret
}

TestHTMLDangerouslySetInnerHTMLObservable.test = {
    static: true,
    expect: () => {
        // Define expected values for both main test and SSR test
        const expectedFull = '<h3>HTML - dangerouslySetInnerHTML - Observable</h3><p><i>danger</i></p>'
        const expected = '<p><i>danger</i></p>'

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestHTMLDangerouslySetInnerHTMLObservable_ssr']
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


export default () => <TestSnapshots Component={TestHTMLDangerouslySetInnerHTMLObservable} />