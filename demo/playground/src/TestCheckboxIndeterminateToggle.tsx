import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert, runSSRTest } from './util'

const name = 'TestCheckboxIndeterminateToggle'
const TestCheckboxIndeterminateToggle = (): JSX.Element => {
    const o = $<boolean>(false)
    const toggle = () => o(prev => !prev)
    useInterval(toggle, TEST_INTERVAL)
    const ret: JSX.Element = () => (
        <>
            <h3>Checkbox - Indeterminate Toggle</h3>
            <input type="checkbox" indeterminate={o} />
            <input type="checkbox" checked indeterminate={o} />
        </>
    )

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}

TestCheckboxIndeterminateToggle.test = {
    static: true,
    expect: () => {
        const expected = '<input type="checkbox"><input type="checkbox">'

        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = `<h3>Checkbox - Indeterminate Toggle</h3><input type="checkbox" /><input type="checkbox" checked="" />`
        if (ssrResult !== expectedFull) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestCheckboxIndeterminateToggle} />

// SSR assertions, driven on the same schedule the browser's <TestSnapshots> uses.
if (typeof window === 'undefined') runSSRTest(name, TestCheckboxIndeterminateToggle)
