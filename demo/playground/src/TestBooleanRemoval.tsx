import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert, runSSRTest } from './util'

const name = 'TestBooleanRemoval'
const TestBooleanRemoval = (): JSX.Element => {
    const o = $<boolean | string>(true)
    // Store the observable globally so the test can access it
    registerTestObservable('TestBooleanRemoval', o)
    const toggle = () => o(prev => prev === true ? null : true)
    useInterval(toggle, TEST_INTERVAL)
    const ret: JSX.Element = () => (
        <>
            <h3>Boolean - Removal</h3>
            <p>({o})</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}

TestBooleanRemoval.test = {
    static: true,
    compareActualValues: true,
    expect: () => {
        const value = $$(testObservables[name])
        // Return the DOM version for comparison with actual
        let expected: string
        if (typeof value === 'boolean') {
            expected = '<p>(<!---->)</p>'
        } else {
            expected = `<p>(${String(value)})</p>`
        }

        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        let expectedFull: string
        if (typeof value === 'boolean') {
            expectedFull = '<h3>Boolean - Removal</h3><p>()</p>'
        } else {
            expectedFull = `<h3>Boolean - Removal</h3><p>${String(value)}</p>`
        }
        if (ssrResult !== expectedFull) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestBooleanRemoval} />

// SSR assertions, driven on the same schedule the browser's <TestSnapshots> uses.
if (typeof window === 'undefined') runSSRTest(name, TestBooleanRemoval)
