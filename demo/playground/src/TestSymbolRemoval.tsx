import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestSymbolRemoval = (): JSX.Element => {
    const ret: JSX.Element = () => (
        <>
            <h3>Symbol - Removal</h3>
            <p>()</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestSymbolRemoval_ssr', ret)

    return ret
}

TestSymbolRemoval.test = {
    static: true,
    expect: () => {
        const expected = '<p>()</p>'

        const ssrComponent = testObservables['TestSymbolRemoval_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<h3>Symbol - Removal</h3><p>()</p>'
        if (ssrResult !== expectedFull) {
            assert(false, `[TestSymbolRemoval] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestSymbolRemoval] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestSymbolRemoval} />