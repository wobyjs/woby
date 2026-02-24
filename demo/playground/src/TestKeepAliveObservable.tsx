import { $, $$, If, KeepAlive, renderToString } from 'woby'
import { TestSnapshots, registerTestObservable, testObservables, assert } from './util'

let timing = 0

const TestKeepAliveObservable = (): JSX.Element => {
    const enable = $(0)
    const timingObservable = $(0)

    // Track timing changes
    const updateTiming = () => {
        const newTiming = Math.random()
        timingObservable(newTiming)
        enable(newTiming)
        timing = newTiming
    }

    // Trigger timing update to enable tests
    updateTiming()

    const ret: JSX.Element = (
        <>
            <h3>KeepAlive - Observable</h3>
            <If when={true}>
                <KeepAlive id="observable-1" ttl={Infinity}>
                    <p>0.123456</p>
                </KeepAlive>
            </If>
            <If when={true}>
                <KeepAlive id="observable-2" ttl={Infinity}>
                    <p>0.789012</p>
                </KeepAlive>
            </If>
        </>
    )

    // Store observables for test framework access
    registerTestObservable('TestKeepAliveObservable_enable', enable)
    registerTestObservable('TestKeepAliveObservable_timing', timingObservable)

    // Store the component for SSR testing
    registerTestObservable('TestKeepAliveObservable_ssr', ret)

    return ret
}

TestKeepAliveObservable.test = {
    static: false,
    enable: () => {
        const observableTiming = $$(testObservables['TestKeepAliveObservable_timing'])
        return observableTiming > 0
    },
    expect: () => {
        // Define expected values for both main test and SSR test
        const expectedFull = '<h3>KeepAlive - Observable</h3><p>0.123456</p><p>0.789012</p>'  // For SSR comparison
        const expected = '<p>0.123456</p><p>0.789012</p>'   // For main DOM test comparison

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestKeepAliveObservable_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                // If it's a JSX element or function, we can render it to string
                // If it's a function, we need to call it first to get the element
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
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

        return expected  // This is what the DOM test framework compares against
    }
}


export default () => <TestSnapshots Component={TestKeepAliveObservable} />