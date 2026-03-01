import { $, $$, Switch, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestSwitchObservable = (): JSX.Element => {
    const ret: JSX.Element = () => (
        <>
            <h3>Switch - Observable</h3>
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

    // Store the component for SSR testing
    registerTestObservable('TestSwitchObservable_ssr', ret)

    return ret
}

TestSwitchObservable.test = {
    static: true,
    expect: () => {
        const expected = '<p>0</p>'

        // Test the SSR value
        const ssrComponent = testObservables['TestSwitchObservable_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<h3>Switch - Observable</h3><p>0</p>'
        if (ssrResult !== expectedFull) {
            assert(false, `[TestSwitchObservable] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestSwitchObservable] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestSwitchObservable} />