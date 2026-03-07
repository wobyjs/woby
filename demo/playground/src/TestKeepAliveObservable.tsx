import { $, $$, If, KeepAlive, renderToString, type JSX } from 'woby'
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

    const ret: JSX.Element = () => (
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

        // Test the SSR value synchronously
        const ssrComponent = testObservables['TestKeepAliveObservable_ssr']
        const ssrResult = renderToString(ssrComponent)
        if (ssrResult !== expectedFull) {
            assert(false, `[TestKeepAliveObservable] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [TestKeepAliveObservable] SSR test passed: ${ssrResult}`)
        }

        return expected  // This is what the DOM test framework compares against
    }
}


export default () => <TestSnapshots Component={TestKeepAliveObservable} />