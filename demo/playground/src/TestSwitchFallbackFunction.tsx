import { $, $$, Switch, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestSwitchFallbackFunction = (): JSX.Element => {
    const Fallback = () => {
        return <p>Fallback: 0.123456</p>  // Static value
    }
    const ret: JSX.Element = (
        <>
            <h3>Switch - Fallback Function</h3>
            <Switch when={-1} fallback={Fallback}>
                <Switch.Case when={0}>
                    <p>case</p>
                </Switch.Case>
            </Switch>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestSwitchFallbackFunction_ssr', ret)

    return ret
}

TestSwitchFallbackFunction.test = {
    static: true,
    expect: () => {
        const expected = '<p>Fallback: 0.123456</p>'

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestSwitchFallbackFunction_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    const expectedFull = '<h3>Switch - Fallback Function</h3><p>Fallback: 0.123456</p>'
                    if (ssrResult !== expectedFull) {
                        assert(false, `[TestSwitchFallbackFunction] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
                    } else {
                        console.log(`✅ [TestSwitchFallbackFunction] SSR test passed: ${ssrResult}`)
                    }
                }).catch(err => {
                    console.error(`[TestSwitchFallbackFunction] SSR render error: ${err}`)
                })
            }
        }, 0)

        return expected
    }
}

// Remove the additional test components


export default () => <TestSnapshots Component={TestSwitchFallbackFunction} />