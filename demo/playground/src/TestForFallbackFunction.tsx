import { $, $$, For, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, random, assert } from './util'

const TestForFallbackFunction = (): JSX.Element => {
    const Fallback = () => {
        const o = $('0.5') // Use fixed value instead of random
        registerTestObservable('TestForFallbackFunction', o)
        // const randomize = () => o(String(random()))
        // useInterval(randomize, TEST_INTERVAL)
        o()
        return (
            <>
                <p>Fallback: {o()}</p>
            </>
        )
    }
    const ret: JSX.Element = () => (
        <>
            <h3>For - Fallback Function</h3>
            <For values={[]} fallback={Fallback}>
                {(value: number) => {
                    return <p>Value: {value}</p>
                }}
            </For>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestForFallbackFunction_ssr', ret)

    return ret
}

TestForFallbackFunction.test = {
    static: true,
    compareActualValues: true,
    expect: () => {
        // Define expected values for both main test and SSR test
        const expectedFull = '<h3>For - Fallback Function</h3><p>Fallback: 0.5</p>'  // For SSR comparison
        const expected = '<p>Fallback: 0.5</p>'   // For main test comparison

        const ssrComponent = testObservables['TestForFallbackFunction_ssr']
        const ssrResult = renderToString(ssrComponent)
        if (ssrResult !== expectedFull) {
            assert(false, `[TestForFallbackFunction] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestForFallbackFunction] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestForFallbackFunction} />