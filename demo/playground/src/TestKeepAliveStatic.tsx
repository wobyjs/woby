import { $, $$, KeepAlive, renderToString, useEffect, type JSX } from 'woby'
import { TestSnapshots, registerTestObservable, testObservables, assert } from './util'

let timing = 0

const name = 'TestKeepAliveStatic'
const TestKeepAliveStatic = (): JSX.Element => {
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
            <h3>KeepAlive - Static</h3>
            <KeepAlive id="static-keepalive" ttl={Infinity}>
                <p>123</p>
            </KeepAlive>
        </>
    )

    // Store observables for test framework access
    registerTestObservable(`${name}_enable`, enable)
    registerTestObservable(`${name}_timing`, timingObservable)

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}

TestKeepAliveStatic.test = {
    static: false,
    enable: () => {
        const observableTiming = $$(testObservables[`${name}_timing`])
        return observableTiming > 0
    },
    expect: () => {
        // Define expected values for both main test and SSR test
        const expectedFull = '<h3>KeepAlive - Static</h3><p>123</p>'  // For SSR comparison
        const expected = '<p>123</p>'   // For main DOM test comparison

        // Test the SSR value synchronously
        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        if (ssrResult !== expectedFull) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [${name}] SSR test passed: ${ssrResult}`)
        }

        return expected  // This is what the DOM test framework compares against
    }
}


export default () => <TestSnapshots Component={TestKeepAliveStatic} />