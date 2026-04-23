import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, randomBigInt, assert } from './util'

const name = 'TestBigIntObservable'
const TestBigIntObservable = (): JSX.Element => {
    const o = $(randomBigInt())
    // Store the observable globally so the test can access it
    registerTestObservable('TestBigIntObservable', o)
    const ret: JSX.Element = () => (
        <>
            <h3>BigInt - Observable</h3>
            <p>{o}</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}

// Conditional: SSR tests (Node.js environment - tsx mode)
if (typeof window === 'undefined') {
    TestBigIntObservable() // Register the component
    const ssrComponent = testObservables[`${name}_ssr`]
    const ssrResult = renderToString(ssrComponent)
    const value = $$(testObservables[name])
    const expectedFull = `<h3>BigInt - Observable</h3><p>${value}n</p>`
    const passed = ssrResult === expectedFull
    console.log(`\n📝 Test: ${name}\n   SSR: ${ssrResult} ${passed ? '✅' : '❌'}\n`)
    if (!passed) { console.error(`❌ [${name}] failed`); process.exit(1) }
}

TestBigIntObservable.test = {
    static: true, // Make it static for predictable testing
    compareActualValues: true, // Use compareActualValues to bypass conversion logic
    expect: () => {
        const value = $$(testObservables[name])
        // Keep 'n' suffix to match actual SSR rendering
        const expected = `<p>${value}n</p>`
        return expected
    }
}


export default () => <TestSnapshots Component={TestBigIntObservable} />