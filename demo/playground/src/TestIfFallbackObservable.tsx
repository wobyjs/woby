import { $, $$, If, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, random, assert } from './util'

let timing = 0
const name = 'TestIfFallbackObservable'
const TestIfFallbackObservable = (): JSX.Element => {
    // Create observables once at component level, not in Fallback function
    const o = $(String(random()))
    const enable = $(0)
    const timingObservable = $(0)
    registerTestObservable('TestIfFallbackObservable', o)
    registerTestObservable('TestIfFallbackObservable_enable', enable)
    registerTestObservable('TestIfFallbackObservable_timing', timingObservable)

    // Track timing changes
    const updateTiming = () => {
        const newTiming = Math.random()
        timingObservable(newTiming)
        enable(newTiming)
        timing = newTiming
    }

    const randomize = () => {
        o(String(random()))
        updateTiming()
    }
    useInterval(randomize, TEST_INTERVAL)

    const Fallback = () => <p>Fallback: {o}</p>

    const ret: JSX.Element = () => (
        <>
            <h3>If - Fallback Observable</h3>
            <If when={false} fallback={<Fallback />}>Children</If>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestIfFallbackObservable_ssr', ret)

    return ret
}

TestIfFallbackObservable.test = {
    static: false,
    enable: () => {
        const observableTiming = $$(testObservables[`${name}_timing`])
        return observableTiming > 0
    },
    compareActualValues: true,
    expect: () => {
        // Capture ALL values FIRST before any operations to avoid timing issues
        const currentTiming = $$(testObservables[`${name}_timing`])
        const value = $$(testObservables['TestIfFallbackObservable'])

        // Build expected strings from captured values
        const expectedFull = `<h3>If - Fallback Observable</h3><p>Fallback: ${value}</p>`
        const expected = `<p>Fallback: ${value}</p>`

        // Update timing to current value to prevent future mismatches
        timing = currentTiming

        // For SSR, we need to ensure it uses the same observable instance
        // The SSR component will render with whatever value is currently in the observable
        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        if (ssrResult !== expectedFull) {
            assert(false, `${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ ${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestIfFallbackObservable} />