import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const name = 'TestClassStatic'
const TestClassStatic = (): JSX.Element => {
    const ret: JSX.Element = () => (
        <>
            <h3>Class - Static</h3>
            <p class={{ red: true, blue: false }}>content</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}

// Conditional: SSR tests (Node.js environment - tsx mode)
if (typeof window === 'undefined') {
    TestClassStatic()
    const ssrComponent = testObservables[`${name}_ssr`]
    const ssrResult = renderToString(ssrComponent)
    const expectedFull = '<h3>Class - Static</h3><p class="red">content</p>'
    const passed = ssrResult === expectedFull
    console.log(`\n📝 Test: ${name}\n   SSR: ${ssrResult} ${passed ? '✅' : '❌'}\n`)
    if (!passed) { console.error(`❌ [${name}] failed`); process.exit(1) }
}

TestClassStatic.test = {
    static: true,
    expect: () => {
        const expected = '<p class="red">content</p>'

        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<h3>Class - Static</h3><p class="red">content</p>'
        if (ssrResult !== expectedFull) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestClassStatic} />