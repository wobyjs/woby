import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestStyleObservableString = (): JSX.Element => {
    const o = $('color: green')
    registerTestObservable('TestStyleObservableString', o)
    const toggle = () => o(prev => (prev === 'color: green') ? 'color: orange' : 'color: green')
    useInterval(toggle, TEST_INTERVAL)
    const ret: JSX.Element = () => (
        <>
            <h3>Style - Observable String</h3>
            <p style={o}>content</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestStyleObservableString_ssr', ret)

    return ret
}

TestStyleObservableString.test = {
    static: false,
    expect: () => {
        const value = $$(testObservables['TestStyleObservableString'])
        const expected = `<p style="${value}">content</p>`

        // Test the SSR value
        const ssrComponent = testObservables['TestStyleObservableString_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = `<h3>Style - Observable String</h3><p style="${value}">content</p>`
        if (ssrResult !== expectedFull) {
            assert(false, `[TestStyleObservableString] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [TestStyleObservableString] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestStyleObservableString} />