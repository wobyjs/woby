import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestForUnkeyedObservablesStatic = (): JSX.Element => {
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
            <h3>For - Unkeyed - Observables Static</h3>
            <For values={values} unkeyed>
                {(value: ObservableReadonly<number>) => {
                    value()
                    return <p>Value: {value()}</p>
                }}
            </For>
        </>
    )
}

TestForUnkeyedObservablesStatic.test = {
    static: true,
    expect: () => '<p>Value: 1</p><p>Value: 2</p><p>Value: 3</p>'
}


export default () => <TestSnapshots Component={TestForUnkeyedObservablesStatic} />