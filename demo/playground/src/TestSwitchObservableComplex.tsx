import { $, $$, Switch, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestSwitchObservableComplex = (): JSX.Element => {
    const ret: JSX.Element = (
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
        
        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestSwitchObservableComplex_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    const expectedFull = '<h3>Switch - Observable Complex</h3><p>1 - 0</p><p>2 - 2</p>'
                    if (ssrResult !== expectedFull) {
                        assert(false, `SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
                    } else {
                        console.log(`✅ SSR test passed: ${ssrResult}`)
                    }
                }).catch(err => {
                    console.error(`SSR render error: ${err}`)
                })
            }
        }, 0)
        
        return expected
    }
}


export default () => <TestSnapshots Component={TestSwitchObservableComplex} />