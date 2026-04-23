import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, random, assert } from './util'

const name = 'TestStringObservable'
const TestStringObservable = (): JSX.Element => {
    const o = $(String(random()))
    // Store the observable globally so the test can access it
    registerTestObservable('TestStringObservable', o)
    const randomize = () => o(String(random()))
    useInterval(randomize, TEST_INTERVAL)
    const ret: JSX.Element = () => (
        <>
            <h3>String - Observable</h3>
            <p>{o}</p>
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
    TestStringObservable()
    const ssrComponent = testObservables[`TestStringObservable_ssr`]
    if (ssrComponent) {
        const ssrResult = renderToString(ssrComponent)
        console.log(`\n📝 Test: TestStringObservable\n   SSR: ${ssrResult} ✅\n`)
    }
}

TestStringObservable.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const value = $$(testObservables[name])
        const expected = `<p>${value}</p>`

        // Test the SSR value
        const ssrComponent = testObservables[`${name}_ssr`]
        if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
            const ssrResult = renderToString(ssrComponent)
            const expectedFull = `<h3>String - Observable</h3><p>${value}</p>`
            if (ssrResult !== expectedFull) {
                assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
            } else {
                console.log(`✅ [${name}] SSR test passed: ${ssrResult}`)
            }
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestStringObservable} />