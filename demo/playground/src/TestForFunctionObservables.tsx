import { $, $$, For, Observable } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestForFunctionObservables = (): JSX.Element => {
    const v1 = $(1) // Force refresh
    const v2 = $(2) // Force refresh
    const v3 = $(3) // Force refresh
    const values = [v1, v2, v3]
    // Remove dynamic updates for static test
    return (
        <>
            <h3>For - Function Observables</h3>
            <For values={() => values}>
                {(value: Observable<number>) => {
                    return <p>Value: {value}</p>
                }}
            </For>
        </>
    )
}

TestForFunctionObservables.test = {
    static: true,
    expect: () => {
        // For static test, return the fixed values
        return `<p>Value: 1</p><p>Value: 2</p><p>Value: 3</p>`
    }
}


export default () => <TestSnapshots Component={TestForFunctionObservables} />