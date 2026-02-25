import { $, $$, Switch, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestSwitchObservable = (): JSX.Element => {
    const ret: JSX.Element = (
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

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestSwitchObservable_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    const expectedFull = '<h3>Switch - Observable</h3><p>0</p>'
                    if (ssrResult !== expectedFull) {
                        assert(false, `[TestSwitchObservable] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
                    } else {
                        console.log(`✅ [TestSwitchObservable] SSR test passed: ${ssrResult}`)
                    }
                }).catch(err => {
                    console.error(`[TestSwitchObservable] SSR render error: ${err}`)
                })
            }
        }, 0)

        return expected
    }
}


export default () => <TestSnapshots Component={TestSwitchObservable} />