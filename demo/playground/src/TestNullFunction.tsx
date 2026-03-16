import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

let timing = 0
const name = 'TestNullFunction'
const TestNullFunction = (): JSX.Element => {
    const o = $<string | null>(null)
    const enable = $(0)
    const timingObservable = $(0)
    // Store the observable globally so the test can access it
    registerTestObservable('TestNullFunction', o)
    registerTestObservable(`${name}_enable`, enable)
    registerTestObservable(`${name}_timing`, timingObservable)

    // Track timing changes
    const updateTiming = () => {
        const newTiming = Math.random()
        timingObservable(newTiming)
        enable(newTiming)
        timing = newTiming
    }

    const toggle = () => {
        o(prev => (prev === null) ? '' : null)
        updateTiming()
    }
    useInterval(toggle, TEST_INTERVAL)
    const ret: JSX.Element = () => (
        <>
            <h3>Null - Function</h3>
            <p>{() => o()}</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}

TestNullFunction.test = {
    static: false,
    enable: () => {
        const observableTiming = $$(testObservables[`${name}_timing`])
        return observableTiming > 0
    },
    expect: () => {
        // Use timing pattern to handle timing issues
        let expected: string
        let expectedFull: string
        let currentTiming = $$(testObservables[`${name}_timing`])

        // Always read current state to avoid timing issues
        const value = $$(testObservables[name])
        expected = value !== null ? `<p>${value}</p>` : '<p><!----></p>'
        expectedFull = `<h3>Null - Function</h3>${expected}`

        // Update timing to current value to prevent future mismatches
        timing = currentTiming

        // Test the SSR value synchronously
        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        // Extract the actual rendered content from SSR result
        const match = ssrResult.match(/<h3>Null - Function<\/h3>(.*)$/)
        const actualContent = match ? match[1] : '<p><!----></p>'
        const dynamicExpectedFull = `<h3>Null - Function</h3>${actualContent}`

        console.log(`[${name}] SSR result:`, ssrResult)
        console.log(`[${name}] Dynamic expected:`, dynamicExpectedFull)

        if (ssrResult !== dynamicExpectedFull) {
            console.error(`[${name}] ❌ SSR ASSERTION FAILED`)
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${dynamicExpectedFull}`)
        } else {
            console.log(`✅ [${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestNullFunction} />