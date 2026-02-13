import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestSwitchCaseFunction = (): JSX.Element => {
    const caseValue = String(random())
    registerTestObservable('TestSwitchCaseFunction', caseValue)
    const Case = () => {
        const o = $(String(random()))
        const randomize = () => o(String(random()))
        useInterval(randomize, TEST_INTERVAL)
        o()
        return <p>Case: {caseValue}</p>
    }
    return (
        <>
            <h3>Switch - Case Function</h3>
            <Switch when={0}>
                <Switch.Case when={0}>
                    {Case}
                </Switch.Case>
                <Switch.Default>
                    <p>default</p>
                </Switch.Default>
            </Switch>
        </>
    )
}

TestSwitchCaseFunction.test = {
    static: true,
    compareActualValues: true,
    expect: () => {
        const caseValue = testObservables['TestSwitchCaseFunction']
        return `<p>Case: ${caseValue}</p>`
    }
}


export default () => <TestSnapshots Component={TestSwitchCaseFunction} />