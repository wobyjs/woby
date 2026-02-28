import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestHTMLDangerouslySetInnerHTMLStatic = (): JSX.Element => {
    const ret: JSX.Element = (
        <>
            <h3>HTML - dangerouslySetInnerHTML - Static</h3>
            <p dangerouslySetInnerHTML={{ __html: '<i>danger</i>' }} />
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestHTMLDangerouslySetInnerHTMLStatic_ssr', ret)

    return ret
}

TestHTMLDangerouslySetInnerHTMLStatic.test = {
    static: true,
    expect: () => {
        const expected = '<p><i>danger</i></p>'

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestHTMLDangerouslySetInnerHTMLStatic_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    const expectedFull = '<h3>HTML - dangerouslySetInnerHTML - Static</h3><p><i>danger</i></p>'
                    if (ssrResult !== expectedFull) {
                        assert(false, `[TestHTMLDangerouslySetInnerHTMLStatic] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
                    } else {
                        console.log(`✅ [TestHTMLDangerouslySetInnerHTMLStatic] SSR test passed: ${ssrResult}`)
                    }
                }).catch(err => {
                    console.error(`[TestHTMLDangerouslySetInnerHTMLStatic] SSR render error: ${err}`)
                })
            }
        }, 0)

        return expected
    }
}


export default () => <TestSnapshots Component={TestHTMLDangerouslySetInnerHTMLStatic} />