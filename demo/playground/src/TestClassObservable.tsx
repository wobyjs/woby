import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestClassObservable = (): JSX.Element => {
    const o = $(true)
    // Store the observable globally so the test can access it
    registerTestObservable('TestClassObservable', o)
    const toggle = () => o(prev => !prev)
    useInterval(toggle, TEST_INTERVAL)
    const ret: JSX.Element = () => (
        <>
            <h3>Class - Observable</h3>
            <p class={{ red: o }}>content</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestClassObservable_ssr', ret)

    return ret
}

TestClassObservable.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const value = $$(testObservables['TestClassObservable'])
        const expected = value ? '<p class="red">content</p>' : '<p class="">content</p>'

        const ssrComponent = testObservables['TestClassObservable_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = value ? '<h3>Class - Observable</h3><p class="red">content</p>' : '<h3>Class - Observable</h3><p>content</p>'
        if (ssrResult !== expectedFull) {
            assert(false, `[TestClassObservable] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [TestClassObservable] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestClassObservable} />