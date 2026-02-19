import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestForUnkeyedFallbackObservable = (): JSX.Element => {
    const o = $(String(random()))
    // Store the observable globally so the test can access it
    registerTestObservable('TestForUnkeyedFallbackObservable', o)
    const randomize = () => o(String(random()))
    useInterval(randomize, TEST_INTERVAL)

    const Fallback = () => {
        return (
            <>
                <p>Fallback: {o}</p>
            </>
        )
    }
    return (
        <>
            <h3>For - Unkeyed - Fallback Observable</h3>
            <For values={[]} fallback={<Fallback />} unkeyed>
                {(value: ObservableReadonly<number>) => {
                    return <p>Value: {value}</p>
                }}
            </For>
        </>
    )
}

TestForUnkeyedFallbackObservable.test = {
    static: false,
    compareActualValues: true,
    expect: () => `<p>Fallback: ${$$(testObservables['TestForUnkeyedFallbackObservable'])}</p>`
}


export default () => <TestSnapshots Component={TestForUnkeyedFallbackObservable} />