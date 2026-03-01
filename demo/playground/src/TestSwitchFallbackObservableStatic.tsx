import { $, $$, Switch, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestSwitchFallbackObservableStatic = (): JSX.Element => {
    const ret: JSX.Element = () => (
        <>
            <h3>Switch - Fallback Observable Static</h3>
            <Switch when={-1} fallback={<p>Fallback: 0.123456</p>}>
                <Switch.Case when={0}>
                    <p>case</p>
                </Switch.Case>
            </Switch>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestSwitchFallbackObservableStatic_ssr', ret)

    return ret
}

TestSwitchFallbackObservableStatic.test = {
    static: true,
    expect: () => {
        const expected = '<p>Fallback: 0.123456</p>'

        // Test the SSR value
        const ssrComponent = testObservables['TestSwitchFallbackObservableStatic_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<h3>Switch - Fallback Observable Static</h3><p>Fallback: 0.123456</p>'
        if (ssrResult !== expectedFull) {
            assert(false, `[TestSwitchFallbackObservableStatic] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestSwitchFallbackObservableStatic] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestSwitchFallbackObservableStatic} />