import { $, $$, For, ObservableReadonly } from 'woby'
import { TestSnapshots } from './util'

const TestForUnkeyedFunctionObservables = (): JSX.Element => {
    const v1 = $(1)
    const v2 = $(2)
    const v3 = $(3)
    const values = [v1, v2, v3]
    // Remove dynamic updates for static test
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
    static: true,
    expect: () => {
        // For static test, return the fixed values
        return `<p>Value: 1</p><p>Value: 2</p><p>Value: 3</p>`
    }
}


export default () => <TestSnapshots Component={TestForUnkeyedFunctionObservables} />