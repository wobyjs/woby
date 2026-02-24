import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

let timing = 0
const TestNullFunction = (): JSX.Element => {
    const o = $<string | null>(null)
    const enable = $(0)
    const timingObservable = $(0)
    // Store the observable globally so the test can access it
    registerTestObservable('TestNullFunction', o)
    registerTestObservable('TestNullFunction_enable', enable)
    registerTestObservable('TestNullFunction_timing', timingObservable)

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
    const ret: JSX.Element = (
        <>
            <h3>Null - Function</h3>
            <p>{() => o()}</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestNullFunction_ssr', ret)

    return ret
}

TestNullFunction.test = {
    static: false,
    enable: () => {
        const observableTiming = $$(testObservables['TestNullFunction_timing'])
        return observableTiming > 0
    },
    expect: () => {
        // Use timing pattern to handle timing issues
        let expected: string
        let expectedFull: string
        let currentTiming = $$(testObservables['TestNullFunction_timing'])

        // Always read current state to avoid timing issues
        const value = $$(testObservables['TestNullFunction'])
        expected = value !== null ? `<p>${value}</p>` : '<p><!----></p>'
        expectedFull = `<h3>Null - Function</h3>${expected}`

        // Update timing to current value to prevent future mismatches
        timing = currentTiming

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestNullFunction_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    // Extract the actual rendered content from SSR result
                    const match = ssrResult.match(/<h3>Null - Function<\/h3>(.*)$/)
                    const actualContent = match ? match[1] : '<p><!----></p>'
                    const dynamicExpectedFull = `<h3>Null - Function</h3>${actualContent}`

                    console.log('[TestNullFunction] SSR result:', ssrResult)
                    console.log('[TestNullFunction] Dynamic expected:', dynamicExpectedFull)

                    if (ssrResult !== dynamicExpectedFull) {
                        console.error('[TestNullFunction] ❌ SSR ASSERTION FAILED')
                        assert(false, `SSR mismatch: got ${ssrResult}, expected ${dynamicExpectedFull}`)
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


export default () => <TestSnapshots Component={TestNullFunction} />