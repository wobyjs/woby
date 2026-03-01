import { $, $$, renderToString } from 'woby'
import { TestSnapshots, registerTestObservable, testObservables, assert } from './util'

const TestHTMLDangerouslySetInnerHTMLFunctionString = (): JSX.Element => {
    // Static value for static test
    const ret: JSX.Element = () => (
        <>
            <h3>HTML - dangerouslySetInnerHTML - Function String</h3>
            <p dangerouslySetInnerHTML={{ __html: '<i>danger</i>' }} />
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestHTMLDangerouslySetInnerHTMLFunctionString_ssr', ret)

    return ret
}

TestHTMLDangerouslySetInnerHTMLFunctionString.test = {
    static: true,
    expect: () => {
        // Define expected values for both main test and SSR test
        const expectedFull = '<h3>HTML - dangerouslySetInnerHTML - Function String</h3><p><i>danger</i></p>'
        const expected = '<p><i>danger</i></p>'

        const ssrComponent = testObservables['TestHTMLDangerouslySetInnerHTMLFunctionString_ssr']
        const ssrResult = renderToString(ssrComponent)
        if (ssrResult !== expectedFull) {
            assert(false, `[TestHTMLDangerouslySetInnerHTMLFunctionString] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestHTMLDangerouslySetInnerHTMLFunctionString] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestHTMLDangerouslySetInnerHTMLFunctionString} />