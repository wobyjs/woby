import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const name = 'TestProgressIndeterminateToggle'
const TestProgressIndeterminateToggle = (): JSX.Element => {
    const o = $<number | null | undefined>(.25)
    registerTestObservable('TestProgressIndeterminateToggle', o)
    const values = [.25, null, .5, undefined]
    const cycle = () => o(prev => values[(values.indexOf(prev) + 1) % values.length])
    useInterval(cycle, TEST_INTERVAL)
    const ret: JSX.Element = () => (
        <>
            <h3>Progress - Indeterminate Toggle</h3>
            <progress value={o} />
        </>
    )

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}


// Conditional: SSR tests (Node.js environment - tsx mode)
if (typeof window === 'undefined') {
    TestProgressIndeterminateToggle()
    const ssrComponent = testObservables[`TestProgressIndeterminateToggle_ssr`]
    if (ssrComponent) {
        const ssrResult = renderToString(ssrComponent)
        console.log(`\n📝 Test: TestProgressIndeterminateToggle\n   SSR: ${ssrResult} ✅\n`)
    }
}

TestProgressIndeterminateToggle.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const val = $$(testObservables[name])
        const expected = (val !== null && val !== undefined) ? `<progress value="${val}"></progress>` : '<progress></progress>'

        // Test the SSR value synchronously
        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<h3>Progress - Indeterminate Toggle</h3>' + expected
        if (ssrResult !== expectedFull) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestProgressIndeterminateToggle} />