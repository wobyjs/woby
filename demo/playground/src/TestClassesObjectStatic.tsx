import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const name = 'TestClassesObjectStatic'
const TestClassesObjectStatic = (): JSX.Element => {
    const ret: JSX.Element = () => (
        <>
            <h3>Classes - Object Static</h3>
            <p class={{ red: true, blue: false }}>content</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}

// Conditional: SSR tests (Node.js environment - tsx mode)
if (typeof window === 'undefined') {
    TestClassesObjectStatic()
    const ssrComponent = testObservables[`${name}_ssr`]
    const ssrResult = renderToString(ssrComponent)
    const expected = '<p class="red">content</p>'
    const expectedFull = `<h3>Classes - Object Static</h3>${expected}`
    const passed = ssrResult === expectedFull
    console.log(`\n📝 Test: ${name}\n   SSR: ${ssrResult} ${passed ? '✅' : '❌'}\n`)
    if (!passed) { console.error(`❌ [${name}] failed`); process.exit(1) }
}

TestClassesObjectStatic.test = {
    static: true,
    expect: () => {
        return '<p class="red">content</p>'
    }
}


export default () => <TestSnapshots Component={TestClassesObjectStatic} />