import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestSymbolObservable = (): JSX.Element => {
    const o = $(Symbol())
    const randomize = () => o(Symbol())
    useInterval(randomize, TEST_INTERVAL)
    const ret: JSX.Element = () => (
        <>
            <h3>Symbol - Observable</h3>
            <p>{o}</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestSymbolObservable_ssr', ret)

    return ret
}

TestSymbolObservable.test = {
    static: true,
    expect: () => {
        const expected = '<p><!----></p>'

        const ssrComponent = testObservables['TestSymbolObservable_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<h3>Symbol - Observable</h3><p><!----></p>'
        if (ssrResult !== expectedFull) {
            assert(false, `[TestSymbolObservable] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [TestSymbolObservable] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestSymbolObservable} />