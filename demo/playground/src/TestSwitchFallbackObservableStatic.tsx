import { $, $$, Switch, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestSwitchFallbackObservableStatic = (): JSX.Element => {
    const ret: JSX.Element = (
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
        
        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestSwitchFallbackObservableStatic_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    const expectedFull = '<h3>Switch - Fallback Observable Static</h3><p>Fallback: 0.123456</p>'
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


export default () => <TestSnapshots Component={TestSwitchFallbackObservableStatic} />