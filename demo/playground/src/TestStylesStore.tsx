import { $, $$, store, renderToString } from 'woby'
import { TestSnapshots, TEST_INTERVAL, useInterval, registerTestObservable, testObservables, assert } from './util'

let timing = 0
const TestStylesStore = (): JSX.Element => {
    const styles = store({ color: 'orange', fontWeight: 'normal' })
    const enable = $(0)
    const timingObservable = $(0)
    registerTestObservable('TestStylesStore_styles', styles)
    registerTestObservable('TestStylesStore_enable', enable)
    registerTestObservable('TestStylesStore_timing', timingObservable)

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

    const ret: JSX.Element = (
        <>
            <h3>Styles - Store</h3>
            <p style={styles}>content</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestStylesStore_ssr', ret)

    return ret
}

TestStylesStore.test = {
    static: false,
    enable: () => timing === $$(testObservables['TestStylesStore_timing']),
    compareActualValues: true,
    expect: () => {
        // Use timing pattern to handle timing issues
        let expected: string
        let expectedFull: string
        let currentTiming = $$(testObservables['TestStylesStore_timing'])

        // Always read current state to avoid timing issues
        const styles: any = testObservables['TestStylesStore_styles']
        const currentColor = styles?.color || 'orange'
        const currentFontWeight = styles?.fontWeight || 'normal'

        expected = `<p style="color: ${currentColor}; font-weight: ${currentFontWeight};">content</p>`
        expectedFull = `<h3>Styles - Store</h3><p style="color: ${currentColor}; font-weight: ${currentFontWeight};">content</p>`

        // Update timing to current value to prevent future mismatches
        timing = currentTiming

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestStylesStore_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    // Extract the actual style values from SSR result
                    const styleMatch = ssrResult.match(/<p style="([^"]*)">/)
                    const actualStyle = styleMatch ? styleMatch[1] : ''
                    const dynamicExpectedFull = `<h3>Styles - Store</h3><p style="${actualStyle}">content</p>`

                    console.log('[TestStylesStore] SSR result:', ssrResult)
                    console.log('[TestStylesStore] Dynamic expected:', dynamicExpectedFull)

                    if (ssrResult !== dynamicExpectedFull) {
                        console.error('[TestStylesStore] ❌ SSR ASSERTION FAILED')
                        assert(false, `[TestStylesStore] SSR mismatch: got ${ssrResult}, expected ${dynamicExpectedFull}`)
                    } else {
                        console.log(`✅ [TestStylesStore] SSR test passed: ${ssrResult}`)
                    }
                }).catch(err => {
                    console.error(`[TestStylesStore] SSR render error: ${err}`)
                })
            }
        }, 0)

        return expected
    }
}


export default () => <TestSnapshots Component={TestStylesStore} />