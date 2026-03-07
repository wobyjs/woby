import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestHTMLOuterHTMLObservable = (): JSX.Element => {
    const o = $('<b>danger1</b>')
    const toggle = () => o(prev => (prev === '<b>danger1</b>') ? '<b>danger2</b>' : '<b>danger1</b>')
    useInterval(toggle, TEST_INTERVAL)
    const ret: JSX.Element = () => (
        <>
            <h3>HTML - outerHTML - Observable</h3>
            <p outerHTML={o} />
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestHTMLOuterHTMLObservable_ssr', ret)

    return ret
}

TestHTMLOuterHTMLObservable.test = {
    static: true,
    expect: () => {
        const expected = '<p></p>'

        const ssrComponent = testObservables['TestHTMLOuterHTMLObservable_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<h3>HTML - outerHTML - Observable</h3><p></p>'
        if (ssrResult !== expectedFull) {
            assert(false, `[TestHTMLOuterHTMLObservable] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [TestHTMLOuterHTMLObservable] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestHTMLOuterHTMLObservable} />