import { $, $$, For, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, random, assert } from './util'

const name = 'TestForFallbackObservableStatic'
const TestForFallbackObservableStatic = (): JSX.Element => {
    const o = $('0.5') // Use fixed value instead of random
    // Store the observable globally so the test can access it
    registerTestObservable('TestForFallbackObservableStatic', o)
    // Remove randomization for static test
    // const randomize = () => o(String(random()))
    // useInterval(randomize, TEST_INTERVAL)
    o()

    const Fallback = () => {
        return (
            <>
                <p>Fallback: {o()}</p>
            </>
        )
    }
    const ret: JSX.Element = () => (
        <>
            <h3>For - Fallback Observable Static</h3>
            <For values={[]} fallback={<Fallback />}>
                {(value: number) => {
                    return <p>Value: {value}</p>
                }}
            </For>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}


// Conditional: SSR tests (Node.js environment - tsx mode)
if (typeof window === 'undefined') {
    TestForFallbackObservableStatic()
    const ssrComponent = testObservables[`TestForFallbackObservableStatic_ssr`]
    if (ssrComponent) {
        const ssrResult = renderToString(ssrComponent)
        console.log(`\n📝 Test: TestForFallbackObservableStatic\n   SSR: ${ssrResult} ✅\n`)
    }
}

TestForFallbackObservableStatic.test = {
    static: true,
    compareActualValues: true,
    expect: () => {
        const expected = `<p>Fallback: 0.5</p>`

        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = `<h3>For - Fallback Observable Static</h3>${expected}`
        if (ssrResult !== expectedFull) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestForFallbackObservableStatic} />