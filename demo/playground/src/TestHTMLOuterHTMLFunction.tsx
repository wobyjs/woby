import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestHTMLOuterHTMLFunction = (): JSX.Element => {
    const o = $('<b>danger1</b>')
    const toggle = () => o(prev => (prev === '<b>danger1</b>') ? '<b>danger2</b>' : '<b>danger1</b>')
    useInterval(toggle, TEST_INTERVAL)
    const ret: JSX.Element = () => (
        <>
            <h3>HTML - outerHTML - Function</h3>
            <p outerHTML={() => o()} />
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestHTMLOuterHTMLFunction_ssr', ret)

    return ret
}

TestHTMLOuterHTMLFunction.test = {
    static: true,
    expect: () => {
        const expected = '<p></p>'

        const ssrComponent = testObservables['TestHTMLOuterHTMLFunction_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<h3>HTML - outerHTML - Function</h3><p></p>'
        if (ssrResult !== expectedFull) {
            assert(false, `[TestHTMLOuterHTMLFunction] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestHTMLOuterHTMLFunction] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestHTMLOuterHTMLFunction} />