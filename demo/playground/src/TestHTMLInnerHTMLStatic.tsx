import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestHTMLInnerHTMLStatic = (): JSX.Element => {
    const ret: JSX.Element = () => (
        <>
            <h3>HTML - innerHTML - Static</h3>
            <p innerHTML="<b>danger</b>" />
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestHTMLInnerHTMLStatic_ssr', ret)

    return ret
}

TestHTMLInnerHTMLStatic.test = {
    static: true,
    expect: () => {
        const expected = '<p></p>'

        const ssrComponent = testObservables['TestHTMLInnerHTMLStatic_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<h3>HTML - innerHTML - Static</h3><p></p>'
        if (ssrResult !== expectedFull) {
            assert(false, `[TestHTMLInnerHTMLStatic] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestHTMLInnerHTMLStatic] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestHTMLInnerHTMLStatic} />