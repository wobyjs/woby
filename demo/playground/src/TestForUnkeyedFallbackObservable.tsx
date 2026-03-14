import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const name = 'TestForUnkeyedFallbackObservable'
const TestForUnkeyedFallbackObservable = (): JSX.Element => {
    const o = $(String(random()))
    // Store the observable globally so the test can access it
    registerTestObservable('TestForUnkeyedFallbackObservable', o)
    const randomize = () => o(String(random()))
    useInterval(randomize, TEST_INTERVAL)

    const Fallback = () => {
        return (
            <>
                <p>Fallback: {o}</p>
            </>
        )
    }
    const ret: JSX.Element = () => (
        <>
            <h3>For - Unkeyed - Fallback Observable</h3>
            <For values={[]} fallback={<Fallback />} unkeyed>
                {(value: ObservableReadonly<number>) => {
                    return <p>Value: {value}</p>
                }}
            </For>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}

TestForUnkeyedFallbackObservable.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const oValue = $$(testObservables[name])

        // Define expected values for both main test and SSR test
        const expectedFull = `<h3>For - Unkeyed - Fallback Observable</h3><p>Fallback: ${oValue}</p>`
        const expected = `<p>Fallback: ${oValue}</p>`

        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        if (ssrResult !== expectedFull) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ ${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestForUnkeyedFallbackObservable} />