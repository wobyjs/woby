import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestClassesArrayObservableValue = (): JSX.Element => {
    const o = $('red')
    // Store the observable globally so the test can access it
    registerTestObservable('TestClassesArrayObservableValue', o)
    const toggle = () => o(prev => prev === 'red' ? 'blue' : 'red')
    useInterval(toggle, TEST_INTERVAL)
    const ret: JSX.Element = () => (
        <>
            <h3>Classes - Array Observable Value</h3>
            <p class={o}>{() => $$(o)}</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestClassesArrayObservableValue_ssr', ret)

    return ret
}

TestClassesArrayObservableValue.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const value = $$(testObservables['TestClassesArrayObservableValue'])
        const expected = `<p class="${value}">${value}</p>`

        const ssrComponent = testObservables['TestClassesArrayObservableValue_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = `<h3>Classes - Array Observable Value</h3>${expected}`
        if (ssrResult !== expectedFull) {
            assert(false, `[TestClassesArrayObservableValue] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestClassesArrayObservableValue] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestClassesArrayObservableValue} />