import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, random, assert } from './util'

const TestStringRemoval = (): JSX.Element => {
    const o = $<string | null>(String(random()))
    // Store the observable globally so the test can access it
    registerTestObservable('TestStringRemoval', o)
    const randomize = () => o(prev => prev ? null : String(random()))
    useInterval(randomize, TEST_INTERVAL)
    const ret: JSX.Element = () => (
        <>
            <h3>String - Removal</h3>
            <p>({o})</p>
        </>
    )

    // Store the component for SSR testing - only in environments where function is available
    if (typeof registerTestObservable !== 'undefined') {
        registerTestObservable('TestStringRemoval_ssr', ret)
    }

    return ret
}

TestStringRemoval.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const val = $$(testObservables['TestStringRemoval'])
        // DOM renders <!----> comment for null, SSR renders empty string
        const expected = val !== null ? `<p>(${val})</p>` : '<p>(<!---->)</p>'

        // Test the SSR value
        const ssrComponent = testObservables['TestStringRemoval_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = val !== null ?
            `<h3>String - Removal</h3><p>(${val})</p>` :
            '<h3>String - Removal</h3><p>()</p>'
        if (ssrResult !== expectedFull) {
            assert(false, `[TestStringRemoval] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [TestStringRemoval] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestStringRemoval} />