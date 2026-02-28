import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestForUnkeyedFallbackFunction = (): JSX.Element => {
    const o = $(String(random()))
    // Store the observable globally so the test can access it
    registerTestObservable('TestForUnkeyedFallbackFunction', o)
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
            <h3>For - Unkeyed - Fallback Function</h3>
            <For values={[]} fallback={Fallback} unkeyed>
                {(value: ObservableReadonly<number>) => {
                    return <p>Value: {value}</p>
                }}
            </For>
        </>
    )
}

TestForUnkeyedFallbackFunction.test = {
    static: false,
    compareActualValues: true,
    expect: () => `<p>Fallback: ${$$(testObservables['TestForUnkeyedFallbackFunction'])}</p>`
}


export default () => <TestSnapshots Component={TestForUnkeyedFallbackFunction} />