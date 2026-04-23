import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const name = 'TestComponentStatic'
const TestComponentStatic = (): JSX.Element => {
    const ret: JSX.Element = () => (
        <>
            <h3>Component - Static</h3>
            <p>content</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}

// Conditional: SSR tests (Node.js environment - tsx mode)
if (typeof window === 'undefined') {
    TestComponentStatic()
    const ssrComponent = testObservables[`${name}_ssr`]
    const ssrResult = renderToString(ssrComponent)
    const expectedFull = '<h3>Component - Static</h3><p>content</p>'
    const passed = ssrResult === expectedFull
    console.log(`\n📝 Test: ${name}\n   SSR: ${ssrResult} ${passed ? '✅' : '❌'}\n`)
    if (!passed) { console.error(`❌ [${name}] failed`); process.exit(1) }
}

TestComponentStatic.test = {
    static: true,
    expect: () => {
        // Define expected values for both main test and SSR test
        const expectedFull = '<h3>Component - Static</h3><p>content</p>'  // For SSR comparison
        const expected = '<p>content</p>'   // For main test comparison

        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        if (ssrResult !== expectedFull) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestComponentStatic} />