import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestClassesArrayFunctionMultiple = (): JSX.Element => {
    const o = $(['red bold', false])
    registerTestObservable('TestClassesArrayFunctionMultiple', o)
    const toggle = () => o(prev => prev[0] ? [false, 'blue'] : ['red bold', false])
    useInterval(toggle, TEST_INTERVAL)
    const ret: JSX.Element = () => (
        <>
            <h3>Classes - Array Function Multiple</h3>
            <p class={() => o()}>content</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestClassesArrayFunctionMultiple_ssr', ret)

    return ret
}

TestClassesArrayFunctionMultiple.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const value = $$(testObservables['TestClassesArrayFunctionMultiple'])
        const classes = Array.isArray(value) ? value.filter(v => v && v !== false).join(' ') : (value || '')

        // Define expected values for both main test and SSR test
        const expectedFull = `<h3>Classes - Array Function Multiple</h3><p class="${classes}">content</p>`  // For SSR comparison
        const expected = `<p class="${classes}">content</p>`   // For main test comparison

        const ssrComponent = testObservables['TestClassesArrayFunctionMultiple_ssr']
        const ssrResult = renderToString(ssrComponent)
        if (ssrResult !== expectedFull) {
            assert(false, `[TestClassesArrayFunctionMultiple] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestClassesArrayFunctionMultiple] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestClassesArrayFunctionMultiple} />