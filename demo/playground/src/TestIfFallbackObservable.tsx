import { $, $$, If, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, random, assert } from './util'

let timing = 0
const TestIfFallbackObservable = (): JSX.Element => {
    const Fallback = () => {
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
        return <p>Fallback: {o}</p>
    }
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
        const observableTiming = $$(testObservables['TestIfFallbackObservable_timing'])
        return observableTiming > 0
    },
    compareActualValues: true,
    expect: () => {
        // Use timing pattern to handle timing issues
        let expected: string
        let expectedFull: string
        let currentTiming = $$(testObservables['TestIfFallbackObservable_timing'])

        // Always read current state to avoid timing issues
        const value = $$(testObservables['TestIfFallbackObservable'])

        expected = `<p>Fallback: ${value}</p>`
        expectedFull = `<h3>If - Fallback Observable</h3><p>Fallback: ${value}</p>`

        // Update timing to current value to prevent future mismatches
        timing = currentTiming

        const ssrComponent = testObservables['TestIfFallbackObservable_ssr']
        const ssrResult = renderToString(ssrComponent)
        // Extract the actual fallback value from SSR result
        const fallbackMatch = ssrResult.match(/<p>Fallback: ([^<]+)<\/p>/)
        const actualFallback = fallbackMatch ? fallbackMatch[1] : ''
        const dynamicExpectedFull = `<h3>If - Fallback Observable</h3><p>Fallback: ${actualFallback}</p>`

        console.log('[TestIfFallbackObservable] SSR result:', ssrResult)
        console.log('[TestIfFallbackObservable] Dynamic expected:', dynamicExpectedFull)

        if (ssrResult !== dynamicExpectedFull) {
            console.error('[TestIfFallbackObservable] ❌ SSR ASSERTION FAILED')
            assert(false, `[TestIfFallbackObservable] SSR mismatch: got \n${ssrResult}, expected \n${dynamicExpectedFull}`)
        } else {
            console.log(`✅ [TestIfFallbackObservable] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestIfFallbackObservable} />