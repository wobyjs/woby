import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestHTMLOuterHTMLStatic = (): JSX.Element => {
    const ret: JSX.Element = () => (
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

            const ssrComponent = testObservables['TestHTMLOuterHTMLStatic_ssr']
            const ssrResult = renderToString(ssrComponent)
            const expectedFull = '<h3>HTML - outerHTML - Static</h3><p></p>'
            if (ssrResult !== expectedFull) {
                assert(false, `[TestHTMLOuterHTMLStatic] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
            } else {
                console.log(`✅ [TestHTMLOuterHTMLStatic] SSR test passed: ${ssrResult}`)
            }

        return expected
    }
}


export default () => <TestSnapshots Component={TestHTMLOuterHTMLStatic} />