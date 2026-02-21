import { $, $$, Switch } from 'woby'
import { TestSnapshots, } from './util'

const TestSwitchFunction = (): JSX.Element => {
    return (
        <>
            <h3>Switch - Function</h3>
            <Switch when={0}>
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
    static: true,
    expect: () => '<p>0</p>'
}


export default () => <TestSnapshots Component={TestSwitchFunction} />