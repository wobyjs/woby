import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestSwitchCaseObservableStatic = (): JSX.Element => {
    const caseValue = String(random())
    registerTestObservable('TestSwitchCaseObservableStatic', caseValue)
    const Case = () => {
        const o = $(String(random()))
        const randomize = () => o(String(random()))
        useInterval(randomize, TEST_INTERVAL)
        o()
        return <p>Case: {caseValue}</p>
    }
    return (
        <>
            <h3>Switch - Case Observable Static</h3>
            <Switch when={0}>
                <Switch.Case when={0}>
                    <Case />
                </Switch.Case>
                <Switch.Default>
                    <p>default</p>
                </Switch.Default>
            </Switch>
        </>
    )
}

TestSwitchCaseObservableStatic.test = {
    static: true,
    compareActualValues: true,
    expect: () => {
        const caseValue = testObservables['TestSwitchCaseObservableStatic']
        return `<p>Case: ${caseValue}</p>`
    }
}


export default () => <TestSnapshots Component={TestSwitchCaseObservableStatic} />