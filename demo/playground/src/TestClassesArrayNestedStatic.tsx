import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const name = 'TestClassesArrayNestedStatic'
const TestClassesArrayNestedStatic = (): JSX.Element => {
    const o = $(['red', ['bold', { 'italic': true }]])
    const ret: JSX.Element = () => (
        <>
            <h3>Classes - Array Nested Static</h3>
            <p class={o}>content</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}

// Conditional: SSR tests (Node.js environment - tsx mode)
if (typeof window === 'undefined') {
    TestClassesArrayNestedStatic() // Register the component
    const ssrComponent = testObservables[`${name}_ssr`]
    const ssrResult = renderToString(ssrComponent)
    const expectedFull = '<h3>Classes - Array Nested Static</h3><p class="red bold italic">content</p>'
    const passed = ssrResult === expectedFull
    console.log(`\n📝 Test: ${name}\n   SSR: ${ssrResult} ${passed ? '✅' : '❌'}\n`)
    if (!passed) { console.error(`❌ [${name}] failed`); process.exit(1) }
}

TestClassesArrayNestedStatic.test = {
    static: true,
    expect: () => {
        return '<p class="red bold italic">content</p>'
    }
}


export default () => <TestSnapshots Component={TestClassesArrayNestedStatic} />