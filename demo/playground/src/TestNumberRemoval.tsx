import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, random, assert } from './util'

const TestNumberRemoval = (): JSX.Element => {
    const o = $<number | null>(random())
    registerTestObservable('TestNumberRemoval', o)
    const randomize = () => o(prev => prev ? null : random())
    useInterval(randomize, TEST_INTERVAL)
    const ret: JSX.Element = () => (
        <>
            <h3>Number - Removal</h3>
            <p>({o})</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestNumberRemoval_ssr', ret)

    return ret
}

TestNumberRemoval.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        // SSR renders null as empty (), DOM renders as (<!---->)
        const val = $$(testObservables['TestNumberRemoval'])
        const expectedForDOM = val !== null ? `<p>(${val})</p>` : '<p>(<!---->)</p>'  // DOM renders <!----> for null
        const expectedForSSR = val !== null ? `<p>(${val})</p>` : '<p>()</p>'  // SSR renders empty () for null

        // Test the SSR value synchronously
        const ssrComponent = testObservables['TestNumberRemoval_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<h3>Number - Removal</h3>' + expectedForSSR
        if (ssrResult !== expectedFull) {
            assert(false, `[TestNumberRemoval] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestNumberRemoval] SSR test passed: ${ssrResult}`)
        }

        return expectedForDOM
    }
}


export default () => <TestSnapshots Component={TestNumberRemoval} />