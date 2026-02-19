import { $, $$, Switch } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestSwitchFallbackObservableStatic = (): JSX.Element => {
    return (
        <>
            <h3>Switch - Fallback Observable Static</h3>
            <Switch when={-1} fallback={<p>Fallback: 0.123456</p>}>
                <Switch.Case when={0}>
                    <p>case</p>
                </Switch.Case>
            </Switch>
        </>
    )
}

TestSwitchFallbackObservableStatic.test = {
    static: true,
    expect: () => '<p>Fallback: 0.123456</p>'
}


export default () => <TestSnapshots Component={TestSwitchFallbackObservableStatic} />