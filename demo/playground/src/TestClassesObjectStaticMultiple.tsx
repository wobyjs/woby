import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const name = 'TestClassesObjectStaticMultiple'
const TestClassesObjectStaticMultiple = (): JSX.Element => {
    const ret: JSX.Element = () => (
        <>
            <h3>Classes - Object Static Multiple</h3>
            <p class={{ 'red bold': true }}>content</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}

// Conditional: SSR tests (Node.js environment - tsx mode)
if (typeof window === 'undefined') {
    TestClassesObjectStaticMultiple()
    const ssrComponent = testObservables[`${name}_ssr`]
    const ssrResult = renderToString(ssrComponent)
    const expected = '<p class="red bold">content</p>'
    const expectedFull = `<h3>Classes - Object Static Multiple</h3>${expected}`
    const passed = ssrResult === expectedFull
    console.log(`\n📝 Test: ${name}\n   SSR: ${ssrResult} ${passed ? '✅' : '❌'}\n`)
    if (!passed) { console.error(`❌ [${name}] failed`); process.exit(1) }
}

TestClassesObjectStaticMultiple.test = {
    static: true,
    expect: () => {
        return '<p class="red bold">content</p>'
    }
}


export default () => <TestSnapshots Component={TestClassesObjectStaticMultiple} />