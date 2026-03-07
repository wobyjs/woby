import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestStyleObservableNumeric = (): JSX.Element => {
    const o = $({ flexGrow: 1, width: 50 })
    registerTestObservable('TestStyleObservableNumeric', o)
    const toggle = () => o(prev => (prev.flexGrow === 1) ? { flexGrow: 2, width: 100 } : { flexGrow: 1, width: 50 })
    useInterval(toggle, TEST_INTERVAL)
    const ret: JSX.Element = () => (
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

        // Test the SSR value
        const ssrComponent = testObservables['TestStyleObservableNumeric_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = `<h3>Style - Observable Numeric</h3><p style="flex-grow: ${value.flexGrow}; width: ${value.width}px;">content</p>`
        if (ssrResult !== expectedFull) {
            assert(false, `[TestStyleObservableNumeric] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [TestStyleObservableNumeric] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestStyleObservableNumeric} />