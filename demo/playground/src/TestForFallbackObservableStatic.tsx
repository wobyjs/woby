import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestForFallbackObservableStatic = (): JSX.Element => {
    const Fallback = () => {
        const o = $(String(random()))
        // Store the observable globally so the test can access it
        registerTestObservable('TestForFallbackObservableStatic', o)
        const randomize = () => o(String(random()))
        useInterval(randomize, TEST_INTERVAL)
        o()
        return (
            <>
                <p>Fallback: {o()}</p>
            </>
        )
    }
    return (
        <>
            <h3>For - Fallback Observable Static</h3>
            <For values={[]} fallback={<Fallback />}>
                {(value: number) => {
                    return <p>Value: {value}</p>
                }}
            </For>
        </>
    )
}

TestForFallbackObservableStatic.test = {
    static: true,
    compareActualValues: true,
    expect: () => `<p>Fallback: ${$$(testObservables['TestForFallbackObservableStatic'])}</p>`
}


export default () => <TestSnapshots Component={TestForFallbackObservableStatic} />