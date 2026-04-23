import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const name = 'TestClassesArrayRemovalMultiple'
const TestClassesArrayRemovalMultiple = (): JSX.Element => {
    const o = $<FunctionUnwrap<JSX.Class> | null>(['red bold', false])
    // Store the observable globally so the test can access it
    registerTestObservable('TestClassesArrayRemovalMultiple', o)
    const toggle = () => o(prev => prev ? null : ['red bold', false])
    useInterval(toggle, TEST_INTERVAL)
    const ret: JSX.Element = () => (
        <>
            <h3>Classes - Array Removal Multiple</h3>
            <p class={o}>content</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}

// Conditional: SSR tests (Node.js environment - tsx mode)
if (typeof window === 'undefined') {
    TestClassesArrayRemovalMultiple() // Register the component
    const ssrComponent = testObservables[`${name}_ssr`]
    const ssrResult = renderToString(ssrComponent)
    const value = $$(testObservables[name])
    let expected: string
    if (!value) expected = '<p class="">content</p>'
    else {
        const classes = Array.isArray(value) ? value.filter(v => v && v !== false).join(' ') : value
        expected = `<p class="${classes}">content</p>`
    }
    const expectedFull = value ? `<h3>Classes - Array Removal Multiple</h3>${expected}` : '<h3>Classes - Array Removal Multiple</h3><p>content</p>'
    const passed = ssrResult === expectedFull
    console.log(`\n📝 Test: ${name}\n   SSR: ${ssrResult} ${passed ? '✅' : '❌'}\n`)
    if (!passed) { console.error(`❌ [${name}] failed`); process.exit(1) }
}

TestClassesArrayRemovalMultiple.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const value = $$(testObservables[name])
        let expected: string
        if (!value) expected = '<p class="">content</p>'
        else {
            const classes = Array.isArray(value) ? value.filter(v => v && v !== false).join(' ') : value
            expected = `<p class="${classes}">content</p>`
        }

        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = value ? `<h3>Classes - Array Removal Multiple</h3>${expected}` : '<h3>Classes - Array Removal Multiple</h3><p>content</p>'
        if (ssrResult !== expectedFull) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestClassesArrayRemovalMultiple} />