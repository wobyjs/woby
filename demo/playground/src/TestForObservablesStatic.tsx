import { $, $$, For, Observable } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestForObservablesStatic = (): JSX.Element => {
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
            <h3>For - Observables Static</h3>
            <For values={values}>
                {(value: Observable<number>) => {
                    value()
                    return <p>Value: {value()}</p>
                }}
            </For>
        </>
    )
}

TestForObservablesStatic.test = {
    static: true,
    expect: () => '<p>Value: 1</p><p>Value: 2</p><p>Value: 3</p>'
}


export default () => <TestSnapshots Component={TestForObservablesStatic} />