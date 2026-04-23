import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const name = 'TestNullRemoval'
const TestNullRemoval = (): JSX.Element => {
    const o = $<string | null>(null)
    // Store the observable globally so the test can access it
    registerTestObservable('TestNullRemoval', o)
    const toggle = () => o(prev => (prev === null) ? '' : null)
    useInterval(toggle, TEST_INTERVAL)
    const ret: JSX.Element = () => (
        <>
            <h3>Null - Removal</h3>
            <p>({o})</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}


// Conditional: SSR tests (Node.js environment - tsx mode)
if (typeof window === 'undefined') {
    TestNullRemoval()
    const ssrComponent = testObservables[`TestNullRemoval_ssr`]
    if (ssrComponent) {
        const ssrResult = renderToString(ssrComponent)
        console.log(`\n📝 Test: TestNullRemoval\n   SSR: ${ssrResult} ✅\n`)
    }
}

TestNullRemoval.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        // SSR renders null as empty (), DOM renders as (<!---->)
        const value = $$(testObservables[name])
        const expectedForDOM = value !== null ? `<p>(${value})</p>` : '<p>(<!---->)</p>'  // DOM renders <!----> for null
        const expectedForSSR = value !== null ? `<p>(${value})</p>` : '<p>()</p>'  // SSR renders empty () for null

        // Test the SSR value synchronously
        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<h3>Null - Removal</h3>' + expectedForSSR
        if (ssrResult !== expectedFull) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [${name}] SSR test passed: ${ssrResult}`)
        }

        return expectedForDOM
    }
}


export default () => <TestSnapshots Component={TestNullRemoval} />