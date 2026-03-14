import { $, $$, Switch, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const name = 'TestSwitchDefaultObservableStatic'
const TestSwitchDefaultObservableStatic = (): JSX.Element => {
    const Default = () => {
        return <p>Default: 0.123456</p>  // Static value
    }
    const ret: JSX.Element = () => (
        <>
            <h3>Switch - Default Observable Static</h3>
            <Switch when={-1}>
                <Switch.Case when={0}>
                    <p>case</p>
                </Switch.Case>
                <Switch.Default>
                    <Default />
                </Switch.Default>
            </Switch>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestSwitchDefaultObservableStatic_ssr', ret)

    return ret
}

TestSwitchDefaultObservableStatic.test = {
    static: true,
    expect: () => {
        const expected = '<p>Default: 0.123456</p>'

        // Test the SSR value
        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<h3>Switch - Default Observable Static</h3><p>Default: 0.123456</p>'
        if (ssrResult !== expectedFull) {
            assert(false, `${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ ${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestSwitchDefaultObservableStatic} />