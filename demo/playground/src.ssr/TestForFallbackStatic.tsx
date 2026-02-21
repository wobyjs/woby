import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestForFallbackStatic = (): JSX.Element => {
    return (
        <>
            <h3>For - Fallback Static</h3>
            <For values={[]} fallback={<div>Fallback!</div>}>
                {(value: number) => {
                    return <p>Value: {value}</p>
                }}
            </For>
        </>
    )
}

TestForFallbackStatic.test = {
    static: true,
    expect: () => '<div>Fallback!</div>'
}


export default () => <TestSnapshots Component={TestForFallbackStatic} />