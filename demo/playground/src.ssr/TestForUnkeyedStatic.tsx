import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestForUnkeyedStatic = (): JSX.Element => {
    const values = [1, 2, 3]
    return (
        <>
            <h3>For - Unkeyed - Static</h3>
            <For values={values} unkeyed>
                {(value: ObservableReadonly<number>) => {
                    return <p>Value: {value}</p>
                }}
            </For>
        </>
    )
}

TestForUnkeyedStatic.test = {
    static: true,
    expect: () => '<p>Value: 1</p><p>Value: 2</p><p>Value: 3</p>'
}


export default () => <TestSnapshots Component={TestForUnkeyedStatic} />