import { $, $$, If, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, random, assert } from './util'

const name = 'TestIfFallbackObservableStatic'
const TestIfFallbackObservableStatic = (): JSX.Element => {
    const initialValue = String(random())
    registerTestObservable('TestIfFallbackObservableStatic', initialValue)
    const Fallback = () => {
        const o = $(String(random()))
        const randomize = () => o(String(random()))
        useInterval(randomize, TEST_INTERVAL)
        o()
        return <p>Fallback: {initialValue}</p>
    }
    const ret: JSX.Element = () => (
        <>
            <h3>If - Fallback Observable Static</h3>
            <If when={false} fallback={<Fallback />}>Children</If>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}


// Conditional: SSR tests (Node.js environment - tsx mode)
if (typeof window === 'undefined') {
    TestIfFallbackObservableStatic()
    const ssrComponent = testObservables[`TestIfFallbackObservableStatic_ssr`]
    if (ssrComponent) {
        const ssrResult = renderToString(ssrComponent)
        console.log(`\n📝 Test: TestIfFallbackObservableStatic\n   SSR: ${ssrResult} ✅\n`)
    }
}

TestIfFallbackObservableStatic.test = {
    static: true,
    compareActualValues: true,
    expect: () => {
        const initialValue = testObservables[name]

        // Define expected values for both main test and SSR test
        const expectedFull = `<h3>If - Fallback Observable Static</h3><p>Fallback: ${initialValue}</p>`
        const expected = `<p>Fallback: ${initialValue}</p>`

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


export default () => <TestSnapshots Component={TestIfFallbackObservableStatic} />