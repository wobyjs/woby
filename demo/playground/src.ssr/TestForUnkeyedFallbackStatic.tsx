import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestForUnkeyedFallbackStatic = (): JSX.Element => {
    return (
        <>
            <h3>For - Unkeyed - Fallback Static</h3>
            <For values={[]} fallback={<div>Fallback!</div>} unkeyed>
                {(value: ObservableReadonly<number>) => {
                    return <p>Value: {value}</p>
                }}
            </For>
        </>
    )
}

TestForUnkeyedFallbackStatic.test = {
    static: true,
    expect: () => '<div>Fallback!</div>'
}


export default () => <TestSnapshots Component={TestForUnkeyedFallbackStatic} />