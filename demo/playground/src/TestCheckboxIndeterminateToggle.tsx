import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

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

// Conditional: SSR tests (Node.js environment - tsx mode)
if (typeof window === 'undefined') {
    TestCheckboxIndeterminateToggle() // Register the component
    const ssrComponent = testObservables[`${name}_ssr`]
    const ssrResult = renderToString(ssrComponent)
    const expectedFull = `<h3>Checkbox - Indeterminate Toggle</h3><input type="checkbox" /><input type="checkbox" checked="" />`
    const passed = ssrResult === expectedFull
    console.log(`\n📝 Test: ${name}\n   SSR: ${ssrResult} ${passed ? '✅' : '❌'}\n`)
    if (!passed) { console.error(`❌ [${name}] failed`); process.exit(1) }
}

TestCheckboxIndeterminateToggle.test = {
    static: true,
    expect: () => {
        return '<input type="checkbox"><input type="checkbox">'
    }
}


export default () => <TestSnapshots Component={TestCheckboxIndeterminateToggle} />