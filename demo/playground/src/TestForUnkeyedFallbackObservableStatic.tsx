import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestForUnkeyedFallbackObservableStatic = (): JSX.Element => {
    const o = $(String(random()))
    // Store the observable globally so the test can access it
    registerTestObservable('TestForUnkeyedFallbackObservableStatic', o)
    const randomize = () => o(String(random()))
    useInterval(randomize, TEST_INTERVAL)
    o()

    const Fallback = () => {
        return (
            <>
                <p>Fallback: {o()}</p>
            </>
        )
    }
    return (
        <>
            <h3>For - Unkeyed - Fallback Observable Static</h3>
            <For values={[]} fallback={<Fallback />} unkeyed>
                {(value: ObservableReadonly<number>) => {
                    return <p>Value: {value}</p>
                }}
            </For>
        </>
    )
}

TestForUnkeyedFallbackObservableStatic.test = {
    static: true,
    compareActualValues: true,
    expect: () => `<p>Fallback: ${$$(testObservables['TestForUnkeyedFallbackObservableStatic'])}</p>`
}


export default () => <TestSnapshots Component={TestForUnkeyedFallbackObservableStatic} />