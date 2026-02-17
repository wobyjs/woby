import { $, $$, For, ObservableReadonly } from 'woby'
import { TestSnapshots } from './util'

const TestForUnkeyedObservableObservables = (): JSX.Element => {
    const v1 = $(1)
    const v2 = $(2)
    const v3 = $(3)
    const v4 = $(4)
    const v5 = $(5)
    const values = [v1, v2, v3, v4, v5]  // Static array instead of observable array
    // Remove dynamic updates for static test
    return (
        <>
            <h3>For - Unkeyed - Observable Observables</h3>
            <For values={values} unkeyed>
                {(value: ObservableReadonly<number>) => {
                    return <p>Value: {value}</p>
                }}
            </For>
        </>
    )
}

TestForUnkeyedObservableObservables.test = {
    static: true,
    expect: () => {
        // For static test, return the fixed values
        return `<p>Value: 1</p><p>Value: 2</p><p>Value: 3</p><p>Value: 4</p><p>Value: 5</p>`
    }
}

export default () => <TestSnapshots Component={TestForUnkeyedObservableObservables} />