import { $, $$, Switch, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestSwitchCaseObservableStatic = (): JSX.Element => {
    const Case = () => {
        return <p>Case: 0.123456</p>  // Static value
    }
    const ret: JSX.Element = (
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
        
        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestSwitchCaseObservableStatic_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    const expectedFull = '<h3>Switch - Case Observable Static</h3><p>Case: 0.123456</p>'
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


export default () => <TestSnapshots Component={TestSwitchCaseObservableStatic} />