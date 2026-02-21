import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestForStatic = (): JSX.Element => {
    const values = [1, 2, 3]
    return (
        <>
            <h3>For - Static</h3>
            <For values={values}>
                {(value: number) => {
                    return <p>Value: {value}</p>
                }}
            </For>
        </>
    )
}

TestForStatic.test = {
    static: true,
    expect: () => '<p>Value: 1</p><p>Value: 2</p><p>Value: 3</p>'
}


export default () => <TestSnapshots Component={TestForStatic} />