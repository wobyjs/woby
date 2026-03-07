import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestClassNameFunction = (): JSX.Element => {
    const o = $('red')
    registerTestObservable('TestClassNameFunction', o)
    const toggle = () => o(prev => (prev === 'red') ? 'blue' : 'red')
    useInterval(toggle, TEST_INTERVAL)
    const ret: JSX.Element = () => (
        <>
            <h3>ClassName - Function</h3>
            <p class={() => o()}>content</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestClassNameFunction_ssr', ret)

    return ret
}

TestClassNameFunction.test = {
    static: false,
    expect: () => {
        const value = $$(testObservables['TestClassNameFunction'])

        // Define expected values for both main test and SSR test
        const expectedFull = `<h3>ClassName - Function</h3><p class="${value}">content</p>`  // For SSR comparison
        const expected = `<p class="${value}">content</p>`   // For main test comparison

        const ssrComponent = testObservables['TestClassNameFunction_ssr']
        const ssrResult = renderToString(ssrComponent)
        if (ssrResult !== expectedFull) {
            assert(false, `[TestClassNameFunction] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [TestClassNameFunction] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestClassNameFunction} />