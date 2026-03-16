import { $, $$, For, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, random, assert } from './util'

const name = 'TestForFallbackObservable'
const TestForFallbackObservable = (): JSX.Element => {
    const o = $('0.5') // Use fixed value instead of random
    const Fallback = () => {
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
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}

TestForFallbackObservable.test = {
    static: true,
    compareActualValues: true,
    expect: () => {
        const expected = `<p>Fallback: 0.5</p>`

        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = `<h3>For - Fallback Observable</h3>${expected}`
        if (ssrResult !== expectedFull) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestForFallbackObservable} />

// console.log('TestForFallbackObservable:')
// console.log(renderToString(<TestForFallbackObservable />))