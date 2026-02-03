import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestIfFallbackObservableStatic = (): JSX.Element => {
    const initialValue = String(random())
    registerTestObservable('TestIfFallbackObservableStatic', initialValue)
    const Fallback = () => {
        const o = $(String(random()))
        const randomize = () => o(String(random()))
        useInterval(randomize, TEST_INTERVAL)
        o()
        return <p>Fallback: {initialValue}</p>
    }
    return (
        <>
            <h3>If - Fallback Observable Static</h3>
            <If when={false} fallback={<Fallback />}>Children</If>
        </>
    )
}

TestIfFallbackObservableStatic.test = {
    static: true,
    compareActualValues: true,
    expect: () => {
        const initialValue = testObservables['TestIfFallbackObservableStatic']
        return `<p>Fallback: ${initialValue}</p>`
    }
}


export default () => <TestSnapshots Component={TestIfFallbackObservableStatic} />