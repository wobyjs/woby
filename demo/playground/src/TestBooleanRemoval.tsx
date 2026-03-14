import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

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
        let ssrExpected: string
        if (typeof value === 'boolean') {
            ssrExpected = '<p>()</p>'
        } else {
            ssrExpected = `<p>${String(value)}</p>`
        }

        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = `<h3>Boolean - Removal</h3>${ssrExpected}`
        if (ssrResult !== expectedFull) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ ${name}] SSR test passed: ${ssrResult}`)
        }

        // Return the DOM version for comparison with actual
        if (typeof value === 'boolean') {
            return '<p>(<!---->)</p>'
        } else {
            return `<p>(${String(value)})</p>`
        }
    }
}


export default () => <TestSnapshots Component={TestBooleanRemoval} />