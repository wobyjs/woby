import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const name = 'TestHTMLOuterHTMLStatic'
const TestHTMLOuterHTMLStatic = (): JSX.Element => {
    const ret: JSX.Element = () => (
        <>
            <h3>HTML - outerHTML - Static</h3>
            <p outerHTML="<b>danger</b>" />
        </>
    )

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}


// Conditional: SSR tests (Node.js environment - tsx mode)
if (typeof window === 'undefined') {
    TestHTMLOuterHTMLStatic()
    const ssrComponent = testObservables[`TestHTMLOuterHTMLStatic_ssr`]
    if (ssrComponent) {
        const ssrResult = renderToString(ssrComponent)
        console.log(`\n📝 Test: TestHTMLOuterHTMLStatic\n   SSR: ${ssrResult} ✅\n`)
    }
}

TestHTMLOuterHTMLStatic.test = {
    static: true,
    expect: () => {
        const expected = '<p></p>'

        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<h3>HTML - outerHTML - Static</h3><p></p>'
        if (ssrResult !== expectedFull) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestHTMLOuterHTMLStatic} />