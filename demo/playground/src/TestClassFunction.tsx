import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestClassFunction = (): JSX.Element => {
    const o = $(true)
    // Store the observable globally so the test can access it
    registerTestObservable('TestClassFunction', o)
    const toggle = () => o(prev => !prev)
    useInterval(toggle, TEST_INTERVAL)
    const ret: JSX.Element = () => (
        <>
            <h3>Class - Function Boolean</h3>
            <p class={{ red: () => o() }}>content</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestClassFunction_ssr', ret)

    return ret
}

TestClassFunction.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const value = $$(testObservables['TestClassFunction'])
        const expected = value ? '<p class="red">content</p>' : '<p class="">content</p>'

        const ssrComponent = testObservables['TestClassFunction_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = value ? '<h3>Class - Function Boolean</h3><p class="red">content</p>' : '<h3>Class - Function Boolean</h3><p>content</p>'
        if (ssrResult !== expectedFull) {
            assert(false, `[TestClassFunction] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [TestClassFunction] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestClassFunction} />