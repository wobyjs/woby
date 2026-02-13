import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestIfFallbackFunction = (): JSX.Element => {
    const initialValue = String(random())
    registerTestObservable('TestIfFallbackFunction', initialValue)
    const Fallback = () => {
        const o = $(String(random()))
        const randomize = () => o(String(random()))
        useInterval(randomize, TEST_INTERVAL)
        o()
        return <p>Fallback: {initialValue}</p>
    }
    return (
        <>
            <h3>If - Fallback Function</h3>
            <If when={false} fallback={Fallback}>Children</If>
        </>
    )
}

TestIfFallbackFunction.test = {
    static: true,
    compareActualValues: true,
    expect: () => {
        const initialValue = testObservables['TestIfFallbackFunction']
        return `<p>Fallback: ${initialValue}</p>`
    }
}


export default () => <TestSnapshots Component={TestIfFallbackFunction} />