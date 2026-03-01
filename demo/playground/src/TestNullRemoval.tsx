import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestNullRemoval = (): JSX.Element => {
    const o = $<string | null>(null)
    // Store the observable globally so the test can access it
    registerTestObservable('TestNullRemoval', o)
    const toggle = () => o(prev => (prev === null) ? '' : null)
    useInterval(toggle, TEST_INTERVAL)
    const ret: JSX.Element = () => (
        <>
            <h3>Null - Removal</h3>
            <p>({o})</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestNullRemoval_ssr', ret)

    return ret
}

TestNullRemoval.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const value = $$(testObservables['TestNullRemoval'])
        const expected = value !== null ? `<p>(${value})</p>` : '<p>(<!---->)</p>'

        // Test the SSR value synchronously
        const ssrComponent = testObservables['TestNullRemoval_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<h3>Null - Removal</h3>' + expected
        if (ssrResult !== expectedFull) {
            assert(false, `[TestNullRemoval] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestNullRemoval] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestNullRemoval} />