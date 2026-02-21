import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestSwitchFallbackObservableStatic = (): JSX.Element => {
    const fallbackValue = String(random())
    registerTestObservable('TestSwitchFallbackObservableStatic', fallbackValue)
    const Fallback = () => {
        const o = $(String(random()))
        const randomize = () => o(String(random()))
        useInterval(randomize, TEST_INTERVAL)
        o()
        return <p>Fallback: {fallbackValue}</p>
    }
    return (
        <>
            <h3>Switch - Fallback Observable Static</h3>
            <Switch when={-1} fallback={<Fallback />}>
                <Switch.Case when={0}>
                    <p>case</p>
                </Switch.Case>
            </Switch>
        </>
    )
}

TestSwitchFallbackObservableStatic.test = {
    static: true,
    compareActualValues: true,
    expect: () => {
        const fallbackValue = testObservables['TestSwitchFallbackObservableStatic']
        return `<p>Fallback: ${fallbackValue}</p>`
    }
}


export default () => <TestSnapshots Component={TestSwitchFallbackObservableStatic} />