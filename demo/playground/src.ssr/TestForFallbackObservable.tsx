import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestForFallbackObservable = (): JSX.Element => {
    const Fallback = () => {
        const o = $(String(random()))
        const randomize = () => o(String(random()))
        useInterval(randomize, TEST_INTERVAL)
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
    static: false,
    compareActualValues: true,
    expect: () => `<p>Fallback: ${$$(testObservables['TestForFallbackObservable'])}</p>`
}


export default () => <TestSnapshots Component={TestForFallbackObservable} />