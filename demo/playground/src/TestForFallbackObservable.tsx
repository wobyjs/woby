import { $, $$, For } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, random } from './util'

const TestForFallbackObservable = (): JSX.Element => {
    const o = $('0.5') // Use fixed value instead of random
    const Fallback = () => {
        // Remove randomization for consistent testing
        // const randomize = () => o(String(random()))
        // useInterval(randomize, TEST_INTERVAL)
        return (
            <>
                <p>Fallback: {o}</p>
            </>
        )
    }
    // Store the observable globally so the test can access it
    registerTestObservable('TestForFallbackObservable', o)
    return (
        <>
            <h3>For - Fallback Observable</h3>
            <For values={[]} fallback={<Fallback />}>
                {(value: number) => {
                    return <p>Value: {value}</p>
                }}
            </For>
        </>
    )
}

TestForFallbackObservable.test = {
    static: true,
    compareActualValues: true,
    expect: () => `<p>Fallback: 0.5</p>`
}


export default () => <TestSnapshots Component={TestForFallbackObservable} />