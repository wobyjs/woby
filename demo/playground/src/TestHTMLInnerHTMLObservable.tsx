import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestHTMLInnerHTMLObservable = (): JSX.Element => {
    const o = $('<b>danger1</b>')
    const toggle = () => o(prev => (prev === '<b>danger1</b>') ? '<b>danger2</b>' : '<b>danger1</b>')
    useInterval(toggle, TEST_INTERVAL)
    const ret: JSX.Element = () => (
        <>
            <h3>HTML - innerHTML - Observable</h3>
            <p innerHTML={o} />
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestHTMLInnerHTMLObservable_ssr', ret)

    return ret
}

TestHTMLInnerHTMLObservable.test = {
    static: true,
    expect: () => {
        const expected = '<p></p>'

        const ssrComponent = testObservables['TestHTMLInnerHTMLObservable_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<h3>HTML - innerHTML - Observable</h3><p></p>'
        if (ssrResult !== expectedFull) {
            assert(false, `[TestHTMLInnerHTMLObservable] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestHTMLInnerHTMLObservable] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestHTMLInnerHTMLObservable} />