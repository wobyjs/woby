import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestSwitchDefaultFunction = (): JSX.Element => {
    const defaultValue = String(random())
    registerTestObservable('TestSwitchDefaultFunction', defaultValue)
    const Default = () => {
        const o = $(String(random()))
        const randomize = () => o(String(random()))
        useInterval(randomize, TEST_INTERVAL)
        o()
        return <p>Default: {defaultValue}</p>
    }
    return (
        <>
            <h3>Switch - Default Function</h3>
            <Switch when={-1}>
                <Switch.Case when={0}>
                    <p>case</p>
                </Switch.Case>
                <Switch.Default>
                    {Default}
                </Switch.Default>
            </Switch>
        </>
    )
}

TestSwitchDefaultFunction.test = {
    static: true,
    compareActualValues: true,
    expect: () => {
        const defaultValue = testObservables['TestSwitchDefaultFunction']
        return `<p>Default: ${defaultValue}</p>`
    }
}


export default () => <TestSnapshots Component={TestSwitchDefaultFunction} />