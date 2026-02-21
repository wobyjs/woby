import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestForUnkeyedFunctionObservables = (): JSX.Element => {
    const v1 = $(1)
    const v2 = $(2)
    const v3 = $(3)
    const values = [v1, v2, v3]
    useInterval(() => {
        v1((v1() + 1) % 5)
        v2((v2() + 1) % 5)
        v3((v3() + 1) % 5)
    }, TEST_INTERVAL)
    return (
        <>
            <h3>For - Unkeyed - Function Observables</h3>
            <For values={() => values} unkeyed>
                {(value: ObservableReadonly<number>) => {
                    return <p>Value: {value}</p>
                }}
            </For>
        </>
    )
}

TestForUnkeyedFunctionObservables.test = {
    static: false,
    expect: () => {
        // This component cycles through values 1-4, wrapping at 5
        const cyclePhase = Math.floor(Date.now() / TEST_INTERVAL) % 5
        const values = [
            [1, 2, 3],
            [2, 3, 4],
            [3, 4, 0],
            [4, 0, 1],
            [0, 1, 2]
        ][cyclePhase]
        return `<p>Value: ${values[0]}</p><p>Value: ${values[1]}</p><p>Value: ${values[2]}</p>`
    }
}


export default () => <TestSnapshots Component={TestForUnkeyedFunctionObservables} />