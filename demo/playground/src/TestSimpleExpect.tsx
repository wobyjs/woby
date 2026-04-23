import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const name = 'TestSimpleExpect'
const TestSimpleExpect = (): JSX.Element => {
    const value = $("Hello World")
    // Store the observable globally so the test can access it
    registerTestObservable('TestSimpleExpect', value)
    const ret: JSX.Element = () => (
        <>
            <h3>Simple Expect Test</h3>
            <p>{value}</p>
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
    TestSimpleExpect()
    const ssrComponent = testObservables[`TestSimpleExpect_ssr`]
    if (ssrComponent) {
        const ssrResult = renderToString(ssrComponent)
        console.log(`\n📝 Test: TestSimpleExpect\n   SSR: ${ssrResult} ✅\n`)
    }
}

TestSimpleExpect.test = {
    static: true,
    compareActualValues: true,
    expect: () => {
        const value = $$(testObservables[name])
        const expected = `<p>${value}</p>`

        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<h3>Simple Expect Test</h3><p>Hello World</p>'
        if (ssrResult !== expectedFull) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestSimpleExpect} />