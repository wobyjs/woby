import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const name = 'TestTabIndexBooleanFunction'
const TestTabIndexBooleanFunction = (): JSX.Element => {
    const ret: JSX.Element = () => (
        <>
            <h3>TabIndex - Boolean - Function</h3>
            <p tabIndex={0}>content</p>
        </>
    )

    // Store the component for SSR testing - only in environments where function is available
    if (typeof registerTestObservable !== 'undefined') {
        registerTestObservable(`${name}_ssr`, ret)
    }

    return ret
}


// Conditional: SSR tests (Node.js environment - tsx mode)
if (typeof window === 'undefined') {
    TestTabIndexBooleanFunction()
    const ssrComponent = testObservables[`TestTabIndexBooleanFunction_ssr`]
    if (ssrComponent) {
        const ssrResult = renderToString(ssrComponent)
        console.log(`\n📝 Test: TestTabIndexBooleanFunction\n   SSR: ${ssrResult} ✅\n`)
    }
}

TestTabIndexBooleanFunction.test = {
    static: true,
    expect: () => {
        const expected = '<p tabindex="0">content</p>'

        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<h3>TabIndex - Boolean - Function</h3><p tabindex="0">content</p>'
        if (ssrResult !== expectedFull) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestTabIndexBooleanFunction} />
