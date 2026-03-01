import { $, $$, For, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, random, assert } from './util'

const TestForFallbackObservable = (): JSX.Element => {
    const o = $('0.5') // Use fixed value instead of random
    const Fallback = () => {
        // Remove randomization for consistent testing
        // const randomize = () => o(String(random()))
        // useInterval(randomize, TEST_INTERVAL)
        return (
            <>
                <p>Fallback: {o}</p>
            </>
        )
    }
    // Store the observable globally so the test can access it
    registerTestObservable('TestForFallbackObservable', o)
    const ret: JSX.Element = () => (
        <>
            <h3>For - Fallback Observable</h3>
            <For values={[]} fallback={<Fallback />}>
                {(value: number) => {
                    return <p>Value: {value}</p>
                }}
            </For>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestForFallbackObservable_ssr', ret)

    return ret
}

TestForFallbackObservable.test = {
    static: true,
    compareActualValues: true,
    expect: () => {
        const expected = `<p>Fallback: 0.5</p>`

        const ssrComponent = testObservables['TestForFallbackObservable_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = `<h3>For - Fallback Observable</h3>${expected}`
        if (ssrResult !== expectedFull) {
            assert(false, `[TestForFallbackObservable] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestForFallbackObservable] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestForFallbackObservable} />