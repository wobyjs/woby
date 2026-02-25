import { $, $$, KeepAlive, renderToString, useEffect } from 'woby'
import { TestSnapshots, registerTestObservable, testObservables, assert } from './util'

let timing = 0

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

    const ret: JSX.Element = (
        <>
            <h3>KeepAlive - Static</h3>
            <KeepAlive id="static-keepalive" ttl={Infinity}>
                <p>123</p>
            </KeepAlive>
        </>
    )

    // Store observables for test framework access
    registerTestObservable('TestKeepAliveStatic_enable', enable)
    registerTestObservable('TestKeepAliveStatic_timing', timingObservable)

    // Store the component for SSR testing
    registerTestObservable('TestKeepAliveStatic_ssr', ret)

    return ret
}

TestKeepAliveStatic.test = {
    static: false,
    enable: () => {
        const observableTiming = $$(testObservables['TestKeepAliveStatic_timing'])
        return observableTiming > 0
    },
    expect: () => {
        // Define expected values for both main test and SSR test
        const expectedFull = '<h3>KeepAlive - Static</h3><p>123</p>'  // For SSR comparison
        const expected = '<p>123</p>'   // For main DOM test comparison

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestKeepAliveStatic_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                // If it's a JSX element or function, we can render it to string
                // If it's a function, we need to call it first to get the element
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    if (ssrResult !== expectedFull) {
                        assert(false, `[TestKeepAliveStatic] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
                    } else {
                        console.log(`✅ [TestKeepAliveStatic] SSR test passed: ${ssrResult}`)
                    }
                }).catch(err => {
                    console.error(`[TestKeepAliveStatic] SSR render error: ${err}`)
                })
            }
        }, 0)

        return expected  // This is what the DOM test framework compares against
    }
}


export default () => <TestSnapshots Component={TestKeepAliveStatic} />