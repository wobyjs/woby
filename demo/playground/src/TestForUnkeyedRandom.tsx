import { $, $$, For, ObservableReadonly, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, useTimeout, TEST_INTERVAL, registerTestObservable, testObservables, random, assert } from './util'
import { useEffect, type JSX } from 'woby'

const name = 'TestForUnkeyedRandom'
const TestForUnkeyedRandom = (): JSX.Element => {
    const values = $([random(), random(), random()])
    // Store the observable globally so the test can access it
    registerTestObservable('TestForUnkeyedRandom', values)

    // Update with new random values occasionally to satisfy "at least one update" requirement
    const update = () => {
        // Generate new random values to ensure actual update occurs
        values([random(), random(), random()])
    }
    // Use interval to ensure updates happen
    useInterval(update, TEST_INTERVAL)

    const ret: JSX.Element = () => (
        <>
            <h3>For - Unkeyed - Random</h3>
            <For values={values} unkeyed>
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

TestForUnkeyedRandom.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        // Get the actual values from the observable
        const values = $$(testObservables[name]) ?? [0, 0, 0]

        // Define expected values for both main test and SSR test
        const expectedFull = `<h3>For - Unkeyed - Random</h3>${values.map(value => `<p>Value: ${value}</p>`).join('')}`
        const expected = values.map(value => `<p>Value: ${value}</p>`).join('')

        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        if (ssrResult !== expectedFull) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ ${name}] SSR test passed: ${ssrResult}`)
        }

        // Get the actual values from the observable and return them
        return expected
    }
}


export default () => <TestSnapshots Component={TestForUnkeyedRandom} />