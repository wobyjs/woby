import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestHTMLDangerouslySetInnerHTMLStatic = (): JSX.Element => {
    const ret: JSX.Element = () => (
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

            const ssrComponent = testObservables['TestHTMLDangerouslySetInnerHTMLStatic_ssr']
            const ssrResult = renderToString(ssrComponent)
            const expectedFull = '<h3>HTML - dangerouslySetInnerHTML - Static</h3><p><i>danger</i></p>'
            if (ssrResult !== expectedFull) {
                assert(false, `[TestHTMLDangerouslySetInnerHTMLStatic] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
            } else {
                console.log(`✅ [TestHTMLDangerouslySetInnerHTMLStatic] SSR test passed: ${ssrResult}`)
            }

        return expected
    }
}


export default () => <TestSnapshots Component={TestHTMLDangerouslySetInnerHTMLStatic} />