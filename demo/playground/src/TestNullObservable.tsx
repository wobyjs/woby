import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestNullObservable = (): JSX.Element => {
    const o = $<string | null>(null)
    // Store the observable globally so the test can access it
    registerTestObservable('TestNullObservable', o)
    const toggle = () => o(prev => (prev === null) ? '' : null)
    useInterval(toggle, TEST_INTERVAL)
    const ret: JSX.Element = () => (
        <>
            <h3>Null - Observable</h3>
            <p>{o}</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestNullObservable_ssr', ret)

    return ret
}

TestNullObservable.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        // SSR renders null as empty <p></p>, DOM renders as <!---->
        const value = $$(testObservables['TestNullObservable'])
        const expectedForDOM = value !== null ? `<p>${value}</p>` : '<p><!----></p>'  // DOM renders <!----> for null
        const expectedForSSR = value !== null ? `<p>${value}</p>` : '<p></p>'  // SSR renders empty p for null

        // Test the SSR value synchronously
        const ssrComponent = testObservables['TestNullObservable_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<h3>Null - Observable</h3>' + expectedForSSR
        if (ssrResult !== expectedFull) {
            assert(false, `[TestNullObservable] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestNullObservable] SSR test passed: ${ssrResult}`)
        }

        return expectedForDOM
    }
}


export default () => <TestSnapshots Component={TestNullObservable} />