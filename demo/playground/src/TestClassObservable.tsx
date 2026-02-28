import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestClassObservable = (): JSX.Element => {
    const o = $(true)
    // Store the observable globally so the test can access it
    registerTestObservable('TestClassObservable', o)
    const toggle = () => o(prev => !prev)
    useInterval(toggle, TEST_INTERVAL)
    const ret: JSX.Element = (
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

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestClassObservable_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    const expectedFull = value ? '<h3>Class - Observable</h3><p class="red">content</p>' : '<h3>Class - Observable</h3><p>content</p>'
                    if (ssrResult !== expectedFull) {
                        assert(false, `[TestClassObservable] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
                    } else {
                        console.log(`✅ [TestClassObservable] SSR test passed: ${ssrResult}`)
                    }
                }).catch(err => {
                    console.error(`[TestClassObservable] SSR render error: ${err}`)
                })
            }
        }, 0)

        return expected
    }
}


export default () => <TestSnapshots Component={TestClassObservable} />