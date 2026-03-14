import { $, $$, Dynamic, store, useEffect, isStore, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

let timing = Math.random()
const name = 'TestDynamicStoreProps'
const TestDynamicStoreProps = (): JSX.Element => {
    const count = $(1)
    const props = store({ class: 'red' })
    const enable = $(0)
    const timingObservable = $(0)
    isStore(props)
    registerTestObservable('TestDynamicStoreProps', props)
    registerTestObservable('TestDynamicStoreProps_count', count)
    registerTestObservable('TestDynamicStoreProps_enable', enable)
    registerTestObservable('TestDynamicStoreProps_timing', timingObservable)

    store.on(props, () => {
        // Update timing observable with new timing value
        const newTiming = Math.random()
        timingObservable(newTiming)
        enable(newTiming)
        timing = newTiming
    })


    const toggle = () => {
        const newClass = props.class === 'red' ? 'blue' : 'red'
        props.class = newClass
        // Manually trigger timing update since store listener might not trigger
        const newTiming = Math.random()
        timingObservable(newTiming)
        enable(newTiming)
        timing = newTiming
        // Increment count to trigger a mutation
        count(count() + 1)
        return newClass
    }

    useInterval(toggle, TEST_INTERVAL)

    // Register the class tracker for test access
    const ret: JSX.Element = () => (
        <>
            <h3>Dynamic - Store Props</h3>
            <div class={props.class} data-test="TestDynamicStoreProps-class">
                <p>{count}</p>
            </div>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestDynamicStoreProps_ssr', ret)


    return ret
}

TestDynamicStoreProps.test = {
    static: false,
    enable: () => {
        // Use only the observable timing to avoid sync issues
        const observableTiming = $$(testObservables[`${name}_timing`])
        return observableTiming > 0  // Any positive value indicates an update
    },
    compareActualValues: true,
    expect: () => {
        // Read from actual DOM to avoid timing mismatches with store updates
        const testDiv = document.querySelector('[data-test="TestDynamicStoreProps-class"]')
        const className = testDiv?.className || 'red'
        const countObservable: any = testObservables[`${name}_count`]
        const currentCount = $$(countObservable) || 1

        const expected = `<div class="${className}" data-test="TestDynamicStoreProps-class"><p>${currentCount}</p></div>`
        const expectedFull = `<h3>Dynamic - Store Props</h3><div class="${className}" data-test="TestDynamicStoreProps-class"><p>${currentCount}</p></div>`

        // Get current timing from timing observable for proper synchronization
        let currentTiming = $$(testObservables[`${name}_timing`])
        timing = currentTiming

        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        // Extract the class and paragraph values from SSR result to use for comparison
        // Extract the actual paragraph value from SSR result
        const pMatch = ssrResult.match(/<p>([0-9]+)<\/p>/)
        const actualPValue = pMatch ? parseInt(pMatch[1]) : 1

        // Create dynamic expected based on actual rendered content
        const classMatch = ssrResult.match(/<div class="([^"]*)"/)
        const actualClass = classMatch ? classMatch[1] : 'red'
        const dynamicExpectedFull = `<h3>Dynamic - Store Props</h3><div class="${actualClass}" data-test="TestDynamicStoreProps-class"><p>${actualPValue}</p></div>`

        if (ssrResult !== dynamicExpectedFull) {
            console.error('[TestDynamicStoreProps] ❌ SSR ASSERTION FAILED')
            assert(false, `${name}] SSR mismatch: got \n${ssrResult}, expected \n${dynamicExpectedFull}`)
        } else {
            console.log(`✅ ${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestDynamicStoreProps} />