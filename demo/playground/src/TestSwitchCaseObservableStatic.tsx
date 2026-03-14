import { $, $$, Switch, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const name = 'TestSwitchCaseObservableStatic'
const TestSwitchCaseObservableStatic = (): JSX.Element => {
    const Case = () => {
        return <p>Case: 0.123456</p>  // Static value
    }
    const ret: JSX.Element = () => (
        <>
            <h3>Switch - Case Observable Static</h3>
            <Switch when={0}>
                <Switch.Case when={0}>
                    <Case />
                </Switch.Case>
                <Switch.Default>
                    <p>default</p>
                </Switch.Default>
            </Switch>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestSwitchCaseObservableStatic_ssr', ret)

    return ret
}

TestSwitchCaseObservableStatic.test = {
    static: true,
    expect: () => {
        const expected = '<p>Case: 0.123456</p>'

        // Test the SSR value
        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<h3>Switch - Case Observable Static</h3><p>Case: 0.123456</p>'
        if (ssrResult !== expectedFull) {
            assert(false, `${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ ${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestSwitchCaseObservableStatic} />