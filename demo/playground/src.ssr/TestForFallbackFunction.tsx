import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestForFallbackFunction = (): JSX.Element => {
    const Fallback = () => {
        const o = $(String(random()))
        // Store the observable globally so the test can access it
        registerTestObservable('TestForFallbackFunction', o)
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
    static: false,
    compareActualValues: true,
    expect: () => `<p>Fallback: ${$$(testObservables['TestForFallbackFunction'])}</p>`
}


export default () => <TestSnapshots Component={TestForFallbackFunction} />