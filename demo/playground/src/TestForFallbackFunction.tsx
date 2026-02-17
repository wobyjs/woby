import { $, $$, For } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, random } from './util'

const TestForFallbackFunction = (): JSX.Element => {
    const Fallback = () => {
        const o = $('0.5') // Use fixed value instead of random
        // Store the observable globally so the test can access it
        registerTestObservable('TestForFallbackFunction', o)
        // Remove randomization for consistent testing
        // const randomize = () => o(String(random()))
        // useInterval(randomize, TEST_INTERVAL)
        o()
        return (
            <>
                <p>Fallback: {o()}</p>
            </>
        )
    }
    return (
        <>
            <h3>For - Fallback Function</h3>
            <For values={[]} fallback={Fallback}>
                {(value: number) => {
                    return <p>Value: {value}</p>
                }}
            </For>
        </>
    )
}

TestForFallbackFunction.test = {
    static: true,
    compareActualValues: true,
    expect: () => `<p>Fallback: 0.5</p>`
}


export default () => <TestSnapshots Component={TestForFallbackFunction} />