import { $, $$, Switch } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestSwitchCaseObservableStatic = (): JSX.Element => {
    const Case = () => {
        return <p>Case: 0.123456</p>  // Static value
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
    expect: () => '<p>Case: 0.123456</p>'
}


export default () => <TestSnapshots Component={TestSwitchCaseObservableStatic} />