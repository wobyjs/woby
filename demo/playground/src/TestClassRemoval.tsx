import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestClassRemoval = (): JSX.Element => {
    const o = $<boolean | null>(true)
    // Store the observable globally so the test can access it
    registerTestObservable('TestClassRemoval', o)
    const toggle = () => o(prev => prev ? null : true)
    useInterval(toggle, TEST_INTERVAL)
    const ret: JSX.Element = () => (
        <>
            <h3>Class - Removal</h3>
            <p class={{ red: o }}>content</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestClassRemoval_ssr', ret)

    return ret
}

TestClassRemoval.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const value = $$(testObservables['TestClassRemoval'])
        const expected = value ? '<p class="red">content</p>' : '<p class="">content</p>'

        const ssrComponent = testObservables['TestClassRemoval_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = value ? '<h3>Class - Removal</h3><p class="red">content</p>' : '<h3>Class - Removal</h3><p>content</p>'
        if (ssrResult !== expectedFull) {
            assert(false, `[TestClassRemoval] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestClassRemoval] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestClassRemoval} />