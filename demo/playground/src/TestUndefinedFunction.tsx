import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestUndefinedFunction = (): JSX.Element => {
    const o = $<string>(undefined)
    // Store the observable globally so the test can access it
    registerTestObservable('TestUndefinedFunction', o)
    const toggle = () => o(prev => (prev === undefined) ? '' : undefined)
    useInterval(toggle, TEST_INTERVAL)
    const ret: JSX.Element = () => (
        <>
            <h3>Undefined - Function</h3>
            <p>{() => o()}</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestUndefinedFunction_ssr', ret)

    return ret
}

TestUndefinedFunction.test = {
    static: false,
    expect: () => {
        const value = $$(testObservables['TestUndefinedFunction'])
        const expected = value !== undefined ? `<p>${value}</p>` : '<p><!----></p>'

        const ssrComponent = testObservables['TestUndefinedFunction_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = value !== undefined ? `<h3>Undefined - Function</h3><p>${value}</p>` : '<h3>Undefined - Function</h3><p><!----></p>'
        if (ssrResult !== expectedFull) {
            assert(false, `[TestUndefinedFunction] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [TestUndefinedFunction] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestUndefinedFunction} />