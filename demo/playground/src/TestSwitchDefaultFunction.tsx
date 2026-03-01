import { $, $$, Switch, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestSwitchDefaultFunction = (): JSX.Element => {
    const Default = () => {
        return <p>Default: 0.123456</p>  // Static value
    }
    const ret: JSX.Element = () => (
        <>
            <h3>Switch - Default Function</h3>
            <Switch when={-1}>
                <Switch.Case when={0}>
                    <p>case</p>
                </Switch.Case>
                <Switch.Default>
                    {Default}
                </Switch.Default>
            </Switch>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestSwitchDefaultFunction_ssr', ret)

    return ret
}

TestSwitchDefaultFunction.test = {
    static: true,
    expect: () => {
        const expected = '<p>Default: 0.123456</p>'

        // Test the SSR value
        const ssrComponent = testObservables['TestSwitchDefaultFunction_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<h3>Switch - Default Function</h3><p>Default: 0.123456</p>'
        if (ssrResult !== expectedFull) {
            assert(false, `[TestSwitchDefaultFunction] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestSwitchDefaultFunction] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestSwitchDefaultFunction} />