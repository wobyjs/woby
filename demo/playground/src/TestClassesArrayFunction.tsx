import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const name = 'TestClassesArrayFunction'
const TestClassesArrayFunction = (): JSX.Element => {
    const o = $(['red', false])
    // Store the observable globally so the test can access it
    registerTestObservable('TestClassesArrayFunction', o)
    const toggle = () => o(prev => prev[0] ? [false, 'blue'] : ['red', false])
    useInterval(toggle, TEST_INTERVAL)
    const ret: JSX.Element = () => (
        <>
            <h3>Classes - Array Function</h3>
            <p class={() => o()}>content</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}

// Conditional: SSR tests (Node.js environment - tsx mode)
if (typeof window === 'undefined') {
    TestClassesArrayFunction() // Register the component
    const ssrComponent = testObservables[`${name}_ssr`]
    const ssrResult = renderToString(ssrComponent)
    const value = $$(testObservables[name])
    const classes = Array.isArray(value) ? value.filter(v => v && v !== false).join(' ') : (value || '')
    const expectedFull = `<h3>Classes - Array Function</h3><p class="${classes}">content</p>`
    const passed = ssrResult === expectedFull
    console.log(`\n📝 Test: ${name}\n   SSR: ${ssrResult} ${passed ? '✅' : '❌'}\n`)
    if (!passed) { console.error(`❌ [${name}] failed`); process.exit(1) }
}

TestClassesArrayFunction.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const value = $$(testObservables[name])
        const classes = Array.isArray(value) ? value.filter(v => v && v !== false).join(' ') : (value || '')
        const expected = `<p class="${classes}">content</p>`

        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = `<h3>Classes - Array Function</h3><p class="${classes}">content</p>`
        if (ssrResult !== expectedFull) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestClassesArrayFunction} />