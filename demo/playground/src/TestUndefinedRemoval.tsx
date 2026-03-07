import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestUndefinedRemoval = (): JSX.Element => {
    const o = $<string>(undefined)
    // Store the observable globally so the test can access it
    registerTestObservable('TestUndefinedRemoval', o)
    const toggle = () => o(prev => (prev === undefined) ? '' : undefined)
    useInterval(toggle, TEST_INTERVAL)
    const ret: JSX.Element = () => (
        <>
            <h3>Undefined - Removal</h3>
            <p>({o})</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestUndefinedRemoval_ssr', ret)

    return ret
}

TestUndefinedRemoval.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const value = $$(testObservables['TestUndefinedRemoval'])
        const expected = value !== undefined ? `<p>(${value})</p>` : '<p>(<!---->)</p>'

        const ssrComponent = testObservables['TestUndefinedRemoval_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = value !== undefined ? `<h3>Undefined - Removal</h3><p>(${value})</p>` : '<h3>Undefined - Removal</h3><p>(<!---->)</p>'
        if (ssrResult !== expectedFull) {
            assert(false, `[TestUndefinedRemoval] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [TestUndefinedRemoval] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestUndefinedRemoval} />