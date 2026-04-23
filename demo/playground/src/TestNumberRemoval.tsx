import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, random, assert } from './util'

const name = 'TestNumberRemoval'
const TestNumberRemoval = (): JSX.Element => {
    const o = $<number | null>(random())
    registerTestObservable('TestNumberRemoval', o)
    const randomize = () => o(prev => prev ? null : random())
    useInterval(randomize, TEST_INTERVAL)
    const ret: JSX.Element = () => (
        <>
            <h3>Number - Removal</h3>
            <p>({o})</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}


// Conditional: SSR tests (Node.js environment - tsx mode)
if (typeof window === 'undefined') {
    TestNumberRemoval()
    const ssrComponent = testObservables[`TestNumberRemoval_ssr`]
    if (ssrComponent) {
        const ssrResult = renderToString(ssrComponent)
        console.log(`\n📝 Test: TestNumberRemoval\n   SSR: ${ssrResult} ✅\n`)
    }
}

TestNumberRemoval.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        // SSR renders null as empty (), DOM renders as (<!---->)
        const val = $$(testObservables[name])
        const expectedForDOM = val !== null ? `<p>(${val})</p>` : '<p>(<!---->)</p>'  // DOM renders <!----> for null
        const expectedForSSR = val !== null ? `<p>(${val})</p>` : '<p>()</p>'  // SSR renders empty () for null

        // Test the SSR value synchronously
        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<h3>Number - Removal</h3>' + expectedForSSR
        if (ssrResult !== expectedFull) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [${name}] SSR test passed: ${ssrResult}`)
        }

        return expectedForDOM
    }
}


export default () => <TestSnapshots Component={TestNumberRemoval} />