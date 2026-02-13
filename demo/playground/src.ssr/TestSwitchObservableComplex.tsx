import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestSwitchObservableComplex = (): JSX.Element => {
    const o = $(0)
    const toggle = () => o(prev => (prev + 1) % 4)
    const o2 = $(2)
    const toggle2 = () => o2(prev => (prev + 1) % 5)
    const o3 = $(4)
    const toggle3 = () => o3(prev => (prev + 1) % 4)
    useInterval(toggle, TEST_INTERVAL)
    useInterval(toggle2, TEST_INTERVAL)
    useInterval(toggle3, TEST_INTERVAL)
    return (
        <>
            <h3>Switch - Observable Complex</h3>
            <Switch when={o}>
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
            <Switch when={o2}>
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
            <Switch when={o3}>
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


export default () => <TestSnapshots Component={TestSwitchObservableComplex} />