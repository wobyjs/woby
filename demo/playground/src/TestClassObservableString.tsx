import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestClassObservableString = (): JSX.Element => {
    const o = $('red')
    registerTestObservable('TestClassObservableString', o)
    const toggle = () => o(prev => (prev === 'red') ? 'blue' : 'red')
    useInterval(toggle, TEST_INTERVAL)
    const ret: JSX.Element = () => (
        <>
            <h3>Class - Observable String</h3>
            <p class={o}>content</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestClassObservableString_ssr', ret)

    return ret
}

TestClassObservableString.test = {
    static: false,
    expect: () => {
        const value = $$(testObservables['TestClassObservableString'])
        const expected = `<p class="${value}">content</p>`

        const ssrComponent = testObservables['TestClassObservableString_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = `<h3>Class - Observable String</h3><p class="${value}">content</p>`
        if (ssrResult !== expectedFull) {
            assert(false, `[TestClassObservableString] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestClassObservableString] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestClassObservableString} />