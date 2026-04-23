import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, randomBigInt, assert } from './util'

const name = 'TestBigIntRemoval'
const TestBigIntRemoval = (): JSX.Element => {
    const o = $<bigint | null>(null)
    registerTestObservable('TestBigIntRemoval', o)
    const ret: JSX.Element = () => (
        <>
            <h3>BigInt - Removal</h3>
            <p>({o})</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}

// Conditional: SSR tests (Node.js environment - tsx mode)
if (typeof window === 'undefined') {
    TestBigIntRemoval() // Register the component
    const ssrComponent = testObservables[`${name}_ssr`]
    const ssrResult = renderToString(ssrComponent)
    const expectedFull = `<h3>BigInt - Removal</h3><p>()</p>`
    const passed = ssrResult === expectedFull
    console.log(`\n📝 Test: ${name}\n   SSR: ${ssrResult} ${passed ? '✅' : '❌'}\n`)
    if (!passed) { console.error(`❌ [${name}] failed`); process.exit(1) }
}

TestBigIntRemoval.test = {
    static: true, // Make it static for predictable testing
    // Let TestSnapshots handle the conversion of BigInt values to placeholders
    expect: () => {
        const expected = '<p>(<!---->)</p>'

        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = `<h3>BigInt - Removal</h3><p>()</p>`
        if (ssrResult !== expectedFull) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestBigIntRemoval} />