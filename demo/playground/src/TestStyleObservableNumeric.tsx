import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestStyleObservableNumeric = (): JSX.Element => {
    const o = $({ flexGrow: 1, width: 50 })
    registerTestObservable('TestStyleObservableNumeric', o)
    const toggle = () => o(prev => (prev.flexGrow === 1) ? { flexGrow: 2, width: 100 } : { flexGrow: 1, width: 50 })
    useInterval(toggle, TEST_INTERVAL)
    const ret: JSX.Element = (
        <>
            <h3>Style - Observable Numeric</h3>
            <p style={o}>content</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestStyleObservableNumeric_ssr', ret)

    return ret
}

TestStyleObservableNumeric.test = {
    static: false,
    expect: () => {
        const value = $$(testObservables['TestStyleObservableNumeric'])
        const expected = `<p style="flex-grow: ${value.flexGrow}; width: ${value.width}px;">content</p>`

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestStyleObservableNumeric_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    const expectedFull = `<h3>Style - Observable Numeric</h3><p style="flex-grow: ${value.flexGrow}; width: ${value.width}px;">content</p>`
                    if (ssrResult !== expectedFull) {
                        assert(false, `[TestStyleObservableNumeric] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
                    } else {
                        console.log(`✅ [TestStyleObservableNumeric] SSR test passed: ${ssrResult}`)
                    }
                }).catch(err => {
                    console.error(`[TestStyleObservableNumeric] SSR render error: ${err}`)
                })
            }
        }, 0)

        return expected
    }
}


export default () => <TestSnapshots Component={TestStyleObservableNumeric} />