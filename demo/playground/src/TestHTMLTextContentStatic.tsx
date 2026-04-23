import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const name = 'TestHTMLTextContentStatic'
const TestHTMLTextContentStatic = (): JSX.Element => {
    const ret: JSX.Element = () => (
        <>
            <h3>HTML - textContent - Static</h3>
            <p textContent="<b>danger</b>" />
        </>
    )

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}


// Conditional: SSR tests (Node.js environment - tsx mode)
if (typeof window === 'undefined') {
    TestHTMLTextContentStatic()
    const ssrComponent = testObservables[`TestHTMLTextContentStatic_ssr`]
    if (ssrComponent) {
        const ssrResult = renderToString(ssrComponent)
        console.log(`\n📝 Test: TestHTMLTextContentStatic\n   SSR: ${ssrResult} ✅\n`)
    }
}

TestHTMLTextContentStatic.test = {
    static: true,
    expect: () => {
        const expected = '<p></p>'

        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<h3>HTML - textContent - Static</h3><p></p>'
        if (ssrResult !== expectedFull) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestHTMLTextContentStatic} />