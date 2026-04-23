import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const name = 'TestHTMLDangerouslySetInnerHTMLStatic'
const TestHTMLDangerouslySetInnerHTMLStatic = (): JSX.Element => {
    const ret: JSX.Element = () => (
        <>
            <h3>HTML - dangerouslySetInnerHTML - Static</h3>
            <p dangerouslySetInnerHTML={{ __html: '<i>danger</i>' }} />
        </>
    )

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}


// Conditional: SSR tests (Node.js environment - tsx mode)
if (typeof window === 'undefined') {
    TestHTMLDangerouslySetInnerHTMLStatic()
    const ssrComponent = testObservables[`TestHTMLDangerouslySetInnerHTMLStatic_ssr`]
    if (ssrComponent) {
        const ssrResult = renderToString(ssrComponent)
        console.log(`\n📝 Test: TestHTMLDangerouslySetInnerHTMLStatic\n   SSR: ${ssrResult} ✅\n`)
    }
}

TestHTMLDangerouslySetInnerHTMLStatic.test = {
    static: true,
    expect: () => {
        const expected = '<p><i>danger</i></p>'

        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<h3>HTML - dangerouslySetInnerHTML - Static</h3><p><i>danger</i></p>'
        if (ssrResult !== expectedFull) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestHTMLDangerouslySetInnerHTMLStatic} />