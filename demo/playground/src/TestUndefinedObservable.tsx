import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestUndefinedObservable = (): JSX.Element => {
    const o = $<string>(undefined)
    // Store the observable globally so the test can access it
    registerTestObservable('TestUndefinedObservable', o)
    const toggle = () => o(prev => (prev === undefined) ? '' : undefined)
    useInterval(toggle, TEST_INTERVAL)
    const ret: JSX.Element = (
        <>
            <h3>Undefined - Observable</h3>
            <p>{o}</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestUndefinedObservable_ssr', ret)

    return ret
}

TestUndefinedObservable.test = {
    static: false,
    expect: () => {
        const value = $$(testObservables['TestUndefinedObservable'])
        const expected = value !== undefined ? `<p>${value}</p>` : '<p><!----></p>'

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestUndefinedObservable_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    const expectedFull = value !== undefined ? `<h3>Undefined - Observable</h3><p>${value}</p>` : '<h3>Undefined - Observable</h3><p><!----></p>'
                    if (ssrResult !== expectedFull) {
                        assert(false, `[TestUndefinedObservable] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
                    } else {
                        console.log(`✅ [TestUndefinedObservable] SSR test passed: ${ssrResult}`)
                    }
                }).catch(err => {
                    console.error(`[TestUndefinedObservable] SSR render error: ${err}`)
                })
            }
        }, 0)

        return expected
    }
}


export default () => <TestSnapshots Component={TestUndefinedObservable} />