import { $, $$, Switch, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestSwitchDefaultObservableStatic = (): JSX.Element => {
    const Default = () => {
        return <p>Default: 0.123456</p>  // Static value
    }
    const ret: JSX.Element = (
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

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestSwitchDefaultObservableStatic_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    const expectedFull = '<h3>Switch - Default Observable Static</h3><p>Default: 0.123456</p>'
                    if (ssrResult !== expectedFull) {
                        assert(false, `[TestSwitchDefaultObservableStatic] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
                    } else {
                        console.log(`✅ [TestSwitchDefaultObservableStatic] SSR test passed: ${ssrResult}`)
                    }
                }).catch(err => {
                    console.error(`[TestSwitchDefaultObservableStatic] SSR render error: ${err}`)
                })
            }
        }, 0)

        return expected
    }
}


export default () => <TestSnapshots Component={TestSwitchDefaultObservableStatic} />