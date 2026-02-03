import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestSwitchStatic = (): JSX.Element => {
    return (
        <>
            <h3>Switch - Static</h3>
            <Switch when={2}>
                <Switch.Case when={0}>
                    <p>0</p>
                </Switch.Case>
                <Switch.Case when={1}>
                    <p>1</p>
                </Switch.Case>
                <Switch.Case when={2}>
                    <p>2</p>
                </Switch.Case>
                <Switch.Default>
                    <p>default</p>
                </Switch.Default>
            </Switch>
        </>
    )
}

TestSwitchStatic.test = {
    static: true,
    expect: () => '<p>2</p>'
}


export default () => <TestSnapshots Component={TestSwitchStatic} />