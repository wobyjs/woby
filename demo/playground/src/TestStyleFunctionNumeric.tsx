import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestStyleFunctionNumeric = (): JSX.Element => {
    const o = $({ flexGrow: 1, width: 50 })
    registerTestObservable('TestStyleFunctionNumeric', o)
    const toggle = () => o(prev => (prev.flexGrow === 1) ? { flexGrow: 2, width: 100 } : { flexGrow: 1, width: 50 })
    useInterval(toggle, TEST_INTERVAL)
    const ret: JSX.Element = () => (
        <>
            <h3>Style - Function Numeric</h3>
            <p style={() => o()}>content</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestStyleFunctionNumeric_ssr', ret)

    return ret
}

TestStyleFunctionNumeric.test = {
    static: false,
    expect: () => {
        const value = $$(testObservables['TestStyleFunctionNumeric'])
        const expected = `<p style="flex-grow: ${value.flexGrow}; width: ${value.width}px;">content</p>`

        // Test the SSR value
        const ssrComponent = testObservables['TestStyleFunctionNumeric_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = `<h3>Style - Function Numeric</h3><p style="flex-grow: ${value.flexGrow}; width: ${value.width}px;">content</p>`
        if (ssrResult !== expectedFull) {
            assert(false, `[TestStyleFunctionNumeric] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestStyleFunctionNumeric] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestStyleFunctionNumeric} />