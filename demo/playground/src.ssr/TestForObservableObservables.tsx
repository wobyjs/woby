import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestForObservableObservables = (): JSX.Element => {
    const v1 = $(1)
    const v2 = $(2)
    const v3 = $(3)
    const v4 = $(4)
    const v5 = $(5)
    const values = $([v1, v2, v3, v4, v5])
    useInterval(() => {
        v1(v1() + 1)
        v2(v2() + 1)
        v3(v3() + 1)
        v4(v4() + 1)
        v5(v5() + 1)
        values(values().slice().sort(() => .5 - random()))
    }, TEST_INTERVAL)
    return (
        <>
            <h3>For - Observable Observables</h3>
            <For values={values}>
                {(value: Observable<number>) => {
                    return <p>Value: {value}</p>
                }}
            </For>
        </>
    )
}


export default () => <TestSnapshots Component={TestForObservableObservables} />