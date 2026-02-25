import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestHTMLOuterHTMLStatic = (): JSX.Element => {
    const ret: JSX.Element = (
        <>
            <h3>HTML - outerHTML - Static</h3>
            <p outerHTML="<b>danger</b>" />
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestHTMLOuterHTMLStatic_ssr', ret)

    return ret
}

TestHTMLOuterHTMLStatic.test = {
    static: true,
    expect: () => {
        const expected = '<p></p>'

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestHTMLOuterHTMLStatic_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    const expectedFull = '<h3>HTML - outerHTML - Static</h3><p></p>'
                    if (ssrResult !== expectedFull) {
                        assert(false, `[TestHTMLOuterHTMLStatic] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
                    } else {
                        console.log(`✅ [TestHTMLOuterHTMLStatic] SSR test passed: ${ssrResult}`)
                    }
                }).catch(err => {
                    console.error(`[TestHTMLOuterHTMLStatic] SSR render error: ${err}`)
                })
            }
        }, 0)

        return expected
    }
}


export default () => <TestSnapshots Component={TestHTMLOuterHTMLStatic} />