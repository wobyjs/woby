import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestTabIndexBooleanFunction = (): JSX.Element => {
    const ret: JSX.Element = () => (
        <>
            <h3>TabIndex - Boolean - Function</h3>
            <p tabIndex={0}>content</p>
        </>
    )

    // Store the component for SSR testing - only in environments where function is available
    if (typeof registerTestObservable !== 'undefined') {
        registerTestObservable('TestTabIndexBooleanFunction_ssr', ret)
    }

    return ret
}

TestTabIndexBooleanFunction.test = {
    static: true,
    expect: () => {
        const expected = '<p tabindex="0">content</p>'

        const ssrComponent = testObservables['TestTabIndexBooleanFunction_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<h3>TabIndex - Boolean - Function</h3><p tabindex="0">content</p>'
        if (ssrResult !== expectedFull) {
            assert(false, `[TestTabIndexBooleanFunction] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [TestTabIndexBooleanFunction] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestTabIndexBooleanFunction} />

console.log(renderToString(<TestTabIndexBooleanFunction />))