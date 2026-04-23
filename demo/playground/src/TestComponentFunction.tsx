import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, random, assert } from './util'

const name = 'TestComponentFunction'
const TestComponentFunction = (): JSX.Element => {
    const getRandom = (): number => random()
    const o = $(getRandom())
    // Store the observable globally so the test can access it
    registerTestObservable('TestComponentFunction', o)
    const randomize = () => o(getRandom())
    useInterval(randomize, TEST_INTERVAL)
    const ret: JSX.Element = () => (
        <>
            <h3>Component - Function</h3>
            <p>{() => o()}</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}

// Conditional: SSR tests (Node.js environment - tsx mode)
if (typeof window === 'undefined') {
    TestComponentFunction()
    const ssrComponent = testObservables[`${name}_ssr`]
    const ssrResult = renderToString(ssrComponent)
    const value = $$(testObservables[name])
    const expectedFull = `<h3>Component - Function</h3><p>${value}</p>`
    const passed = ssrResult === expectedFull
    console.log(`\n📝 Test: ${name}\n   SSR: ${ssrResult} ${passed ? '✅' : '❌'}\n`)
    if (!passed) { console.error(`❌ [${name}] failed`); process.exit(1) }
}

TestComponentFunction.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const value = $$(testObservables[name])

        // Define expected values for both main test and SSR test
        const expectedFull = `<h3>Component - Function</h3><p>${value}</p>`  // For SSR comparison
        const expected = `<p>${value}</p>`   // For main test comparison

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


export default () => <TestSnapshots Component={TestComponentFunction} />