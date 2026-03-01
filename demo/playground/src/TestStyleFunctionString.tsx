import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestStyleFunctionString = (): JSX.Element => {
    const o = $('color: green')
    registerTestObservable('TestStyleFunctionString', o)
    const toggle = () => o(prev => (prev === 'color: green') ? 'color: orange' : 'color: green')
    useInterval(toggle, TEST_INTERVAL)
    const ret: JSX.Element = () => (
        <>
            <h3>Style - Function String</h3>
            <p style={() => o()}>content</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestStyleFunctionString_ssr', ret)

    return ret
}

TestStyleFunctionString.test = {
    static: false,
    expect: () => {
        const value = $$(testObservables['TestStyleFunctionString'])
        const expected = `<p style="${value}">content</p>`

        // Test the SSR value
        const ssrComponent = testObservables['TestStyleFunctionString_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = `<h3>Style - Function String</h3><p style="${value}">content</p>`
        if (ssrResult !== expectedFull) {
            assert(false, `[TestStyleFunctionString] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestStyleFunctionString] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestStyleFunctionString} />