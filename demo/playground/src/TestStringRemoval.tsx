import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, random, assert } from './util'

const name = 'TestStringRemoval'
const TestStringRemoval = (): JSX.Element => {
    const o = $<string | null>(String(random()))
    // Store the observable globally so the test can access it
    registerTestObservable('TestStringRemoval', o)
    const randomize = () => o(prev => prev ? null : String(random()))
    useInterval(randomize, TEST_INTERVAL)
    const ret: JSX.Element = () => (
        <>
            <h3>String - Removal</h3>
            <p>({o})</p>
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
    TestStringRemoval()
    const ssrComponent = testObservables[`TestStringRemoval_ssr`]
    if (ssrComponent) {
        const ssrResult = renderToString(ssrComponent)
        console.log(`\n📝 Test: TestStringRemoval\n   SSR: ${ssrResult} ✅\n`)
    }
}

TestStringRemoval.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const val = $$(testObservables[name])
        // DOM renders <!----> comment for null, SSR renders empty string
        const expected = val !== null ? `<p>(${val})</p>` : '<p>(<!---->)</p>'

        // Test the SSR value
        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = val !== null ?
            `<h3>String - Removal</h3><p>(${val})</p>` :
            '<h3>String - Removal</h3><p>()</p>'
        if (ssrResult !== expectedFull) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestStringRemoval} />