import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestSwitchFunction = (): JSX.Element => {
    const o = $(0)
    const toggle = () => o(prev => (prev + 1) % 4)
    useInterval(toggle, TEST_INTERVAL)
    return (
        <>
            <h3>Switch - Function</h3>
            <Switch when={() => o()}>
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

TestSwitchFunction.test = {
    static: false,
    expect: () => '<p>0</p>'
}


export default () => <TestSnapshots Component={TestSwitchFunction} />