import { $, $$, Switch, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestSwitchObservableComplex = (): JSX.Element => {
    const ret: JSX.Element = () => (
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

    // Store the component for SSR testing
    registerTestObservable('TestSwitchObservableComplex_ssr', ret)

    return ret
}

TestSwitchObservableComplex.test = {
    static: true,
    expect: () => {
        const expected = '<p>1 - 0</p><p>2 - 2</p>'

        const ssrComponent = testObservables['TestSwitchObservableComplex_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<h3>Switch - Observable Complex</h3><p>1 - 0</p><p>2 - 2</p>'
        if (ssrResult !== expectedFull) {
            assert(false, `[TestSwitchObservableComplex] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [TestSwitchObservableComplex] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestSwitchObservableComplex} />