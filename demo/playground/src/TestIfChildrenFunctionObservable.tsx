import { $, $$, If, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestIfChildrenFunctionObservable = (): JSX.Element => {
    const o = $<number | false>(Math.random())
    registerTestObservable('TestIfChildrenFunctionObservable', o)
    const toggle = () => o(prev => prev ? false : Math.random())
    useInterval(toggle, TEST_INTERVAL)
    const Content = ({ value }): JSX.Element => {
        return <p>Value: {value}</p>
    }
    const ret: JSX.Element = (
        <>
            <h3>If - Children Function Observable</h3>
            <If when={o}>
                {value => <Content value={value} />}
            </If>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestIfChildrenFunctionObservable_ssr', ret)

    return ret
}

TestIfChildrenFunctionObservable.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const val = $$(testObservables['TestIfChildrenFunctionObservable'])

        // Define expected values for both main test and SSR test
        const expectedFull = val !== false ? `<h3>If - Children Function Observable</h3><p>Value: ${val}</p>` : `<h3>If - Children Function Observable</h3><!---->`
        const expected = val !== false ? `<p>Value: ${val}</p>` : '<!---->'

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestIfChildrenFunctionObservable_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    if (ssrResult !== expectedFull) {
                        assert(false, `[TestIfChildrenFunctionObservable] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
                    } else {
                        console.log(`✅ [TestIfChildrenFunctionObservable] SSR test passed: ${ssrResult}`)
                    }
                }).catch(err => {
                    console.error(`[TestIfChildrenFunctionObservable] SSR render error: ${err}`)
                })
            }
        }, 0)

        return expected
    }
}


export default () => <TestSnapshots Component={TestIfChildrenFunctionObservable} />