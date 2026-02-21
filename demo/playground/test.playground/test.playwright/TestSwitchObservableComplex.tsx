import { $, $$, Switch } from 'woby'
import { TestSnapshots, } from './util'

const TestSwitchObservableComplex = (): JSX.Element => {
    return (
        <>
            <h3>Switch - Observable Complex</h3>
            <Switch when={0}>
                <Switch.Case when={0}>
                    <p>1 - 0</p>
                </Switch.Case>
                <Switch.Case when={1}>
                    <p>1 - 1</p>
                </Switch.Case>
                <Switch.Case when={2}>
                    <p>1 - 2</p>
                </Switch.Case>
            </Switch>
            <Switch when={2}>
                <Switch.Case when={0}>
                    <p>2 - 0</p>
                </Switch.Case>
                <Switch.Case when={1}>
                    <p>2 - 1</p>
                </Switch.Case>
                <Switch.Case when={2}>
                    <p>2 - 2</p>
                </Switch.Case>
            </Switch>
            <Switch when={4}>
                <Switch.Case when={0}>
                    <p>3 - 0</p>
                </Switch.Case>
                <Switch.Case when={1}>
                    <p>3 - 1</p>
                </Switch.Case>
                <Switch.Case when={2}>
                    <p>3 - 2</p>
                </Switch.Case>
            </Switch>
        </>
    )
}

TestSwitchObservableComplex.test = {
    static: true,
    expect: () => '<p>1 - 0</p><p>2 - 2</p>'
}


export default () => <TestSnapshots Component={TestSwitchObservableComplex} />