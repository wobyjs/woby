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
        // SSR renders null as empty (), DOM renders as (<!---->)
        const value = $$(testObservables['TestNullRemoval'])
        const expectedForDOM = value !== null ? `<p>(${value})</p>` : '<p>(<!---->)</p>'  // DOM renders <!----> for null
        const expectedForSSR = value !== null ? `<p>(${value})</p>` : '<p>()</p>'  // SSR renders empty () for null

        // Test the SSR value synchronously
        const ssrComponent = testObservables['TestNullRemoval_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<h3>Null - Removal</h3>' + expectedForSSR
        if (ssrResult !== expectedFull) {
            assert(false, `[TestNullRemoval] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestNullRemoval] SSR test passed: ${ssrResult}`)
        }

        return expectedForDOM
    }
}


export default () => <TestSnapshots Component={TestNullRemoval} />