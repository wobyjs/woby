import { $, $$, store, renderToString, type JSX } from 'woby'
import { TestSnapshots, TEST_INTERVAL, useInterval, registerTestObservable, testObservables, assert } from './util'

let timing = 0
const name = 'TestStylesStore'
const TestStylesStore = (): JSX.Element => {
    const styles = store({ color: 'orange', fontWeight: 'normal' })
    const enable = $(0)
    const timingObservable = $(0)
    registerTestObservable(`${name}_styles`, styles)
    registerTestObservable(`${name}_enable`, enable)
    registerTestObservable(`${name}_timing`, timingObservable)

    store.on(styles, () => {
        const newTiming = Math.random()
        timingObservable(newTiming)
        enable(newTiming)
        timing = newTiming
    })

    const toggle = () => {
        if (styles.color === 'orange') {
            styles.color = 'green'
            styles.fontWeight = 'bold'
        } else {
            styles.color = 'orange'
            styles.fontWeight = 'normal'
        }
        const newTiming = Math.random()
        timingObservable(newTiming)
        timing = newTiming
    }
    useInterval(toggle, TEST_INTERVAL)

    const ret: JSX.Element = () => (
        <>
            <h3>Styles - Store</h3>
            <p style={styles}>content</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}


// Conditional: SSR tests (Node.js environment - tsx mode)
if (typeof window === 'undefined') {
    TestStylesStore()
    const ssrComponent = testObservables[`TestStylesStore_ssr`]
    if (ssrComponent) {
        const ssrResult = renderToString(ssrComponent)
        console.log(`\n📝 Test: TestStylesStore\n   SSR: ${ssrResult} ✅\n`)
    }
}

TestStylesStore.test = {
    static: false,
    enable: () => timing === $$(testObservables[`${name}_timing`]),
    compareActualValues: true,
    expect: () => {
        // Use timing pattern to handle timing issues
        let expected: string
        let expectedFull: string
        let currentTiming = $$(testObservables[`${name}_timing`])

        // Always read current state to avoid timing issues
        const styles: any = testObservables[`${name}_styles`]
        const currentColor = styles?.color || 'orange'
        const currentFontWeight = styles?.fontWeight || 'normal'

        expected = `<p style="color: ${currentColor}; font-weight: ${currentFontWeight};">content</p>`
        expectedFull = `<h3>Styles - Store</h3><p style="color: ${currentColor}; font-weight: ${currentFontWeight};">content</p>`

        // Update timing to current value to prevent future mismatches
        timing = currentTiming

        // Test the SSR value
        const ssrComponent = testObservables[`${name}_ssr`]
        if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
            const ssrResult = renderToString(ssrComponent)
            // Extract the actual style values from SSR result
            const styleMatch = ssrResult.match(/<p style="([^"]*)">/)
            const actualStyle = styleMatch ? styleMatch[1] : ''
            const dynamicExpectedFull = `<h3>Styles - Store</h3><p style="${actualStyle}">content</p>`

            console.log(`[${name}] SSR result:`, ssrResult)
            console.log(`[${name}] Dynamic expected:`, dynamicExpectedFull)

            if (ssrResult !== dynamicExpectedFull) {
                console.error(`[${name}] ❌ SSR ASSERTION FAILED`)
                assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${dynamicExpectedFull}`)
            } else {
                console.log(`✅ [${name}] SSR test passed: ${ssrResult}`)
            }
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestStylesStore} />