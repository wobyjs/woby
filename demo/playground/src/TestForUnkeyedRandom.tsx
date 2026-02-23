import { $, $$, For, ObservableReadonly } from 'woby'
import { TestSnapshots, useInterval, useTimeout, TEST_INTERVAL, registerTestObservable, testObservables, random } from './util'
import { useEffect } from 'woby'

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

    return (
        <>
            <h3>For - Unkeyed - Random</h3>
            <For values={values} unkeyed>
                {(value: ObservableReadonly<number>) => {
                    return <p>Value: {value}</p>
                }}
            </For>
        </>
    )
}

TestForUnkeyedRandom.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        // Get the actual values from the observable and return them
        const values = testObservables['TestForUnkeyedRandom']?.() ?? [0, 0, 0]
        return values.map(value => `<p>Value: ${value}</p>`).join('')
    }
}


export default () => <TestSnapshots Component={TestForUnkeyedRandom} />