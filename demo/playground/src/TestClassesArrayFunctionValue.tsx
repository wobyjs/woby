import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestClassesArrayFunctionValue = (): JSX.Element => {
    const o = $('red')
    registerTestObservable('TestClassesArrayFunctionValue', o)
    const toggle = () => o(prev => prev === 'red' ? 'blue' : 'red')
    useInterval(toggle, TEST_INTERVAL)
    const ret: JSX.Element = () => (
        <>
            <h3>Classes - Array Function Value</h3>
            <p class={[() => o()]}>content</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestClassesArrayFunctionValue_ssr', ret)

    return ret
}

TestClassesArrayFunctionValue.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const value = $$(testObservables['TestClassesArrayFunctionValue'])

        // Define expected values for both main test and SSR test
        const expectedFull = `<h3>Classes - Array Function Value</h3><p class="${value}">content</p>`  // For SSR comparison
        const expected = `<p class="${value}">content</p>`   // For main test comparison

        const ssrComponent = testObservables['TestClassesArrayFunctionValue_ssr']
        const ssrResult = renderToString(ssrComponent)
        if (ssrResult !== expectedFull) {
            assert(false, `[TestClassesArrayFunctionValue] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestClassesArrayFunctionValue] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestClassesArrayFunctionValue} />