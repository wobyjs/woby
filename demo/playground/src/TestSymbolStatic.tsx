import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const name = 'TestSymbolStatic'
const TestSymbolStatic = (): JSX.Element => (
    <>
        <h3>Symbol - Static</h3>
        <p>{Symbol()}</p>
    </>
)


// Conditional: SSR tests (Node.js environment - tsx mode)
if (typeof window === 'undefined') {
    TestSymbolStatic()
    const ssrComponent = testObservables[`TestSymbolStatic_ssr`]
    if (ssrComponent) {
        const ssrResult = renderToString(ssrComponent)
        console.log(`\n📝 Test: TestSymbolStatic\n   SSR: ${ssrResult} ✅\n`)
    }
}

TestSymbolStatic.test = {
    static: true,
    expect: () => {
        const expected = '<p></p>'

        const ssrResult = renderToString(<TestSymbolStatic />)
        const expectedFull = '<h3>Symbol - Static</h3><p></p>'
        if (ssrResult !== expectedFull) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestSymbolStatic} />
