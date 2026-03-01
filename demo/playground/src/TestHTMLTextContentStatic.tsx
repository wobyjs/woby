import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestHTMLTextContentStatic = (): JSX.Element => {
    const ret: JSX.Element = () => (
        <>
            <h3>HTML - textContent - Static</h3>
            <p textContent="<b>danger</b>" />
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestHTMLTextContentStatic_ssr', ret)

    return ret
}

TestHTMLTextContentStatic.test = {
    static: true,
    expect: () => {
        const expected = '<p></p>'

            const ssrComponent = testObservables['TestHTMLTextContentStatic_ssr']
            const ssrResult = renderToString(ssrComponent)
            const expectedFull = '<h3>HTML - textContent - Static</h3><p></p>'
            if (ssrResult !== expectedFull) {
                assert(false, `[TestHTMLTextContentStatic] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
            } else {
                console.log(`✅ [TestHTMLTextContentStatic] SSR test passed: ${ssrResult}`)
            }

        return expected
    }
}


export default () => <TestSnapshots Component={TestHTMLTextContentStatic} />