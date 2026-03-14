import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const name = 'TestSymbolStatic'
const TestSymbolStatic = (): JSX.Element => (
    <>
        <h3>Symbol - Static</h3>
        <p>{Symbol()}</p>
    </>
)

TestSymbolStatic.test = {
    static: true,
    expect: () => {
        const expected = '<p></p>'

        const ssrResult = renderToString(<TestSymbolStatic />)
        const expectedFull = '<h3>Symbol - Static</h3><p></p>'
        if (ssrResult !== expectedFull) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ ${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestSymbolStatic} />

// console.log(renderToString(<TestSymbolStatic />))