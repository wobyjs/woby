import { $, $$, renderToString, type JSX } from 'woby'
import type { FunctionUnwrap } from './util'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestStylesRemoval = (): JSX.Element => {
    const o = $<FunctionUnwrap<JSX.Style> | null>({ color: 'orange', fontWeight: 'normal' })
    registerTestObservable('TestStylesRemoval', o)
    const toggle = () => o(prev => prev ? null : { color: 'orange', fontWeight: 'normal' })
    useInterval(toggle, TEST_INTERVAL)
    const ret: JSX.Element = () => (
        <>
            <h3>Styles - Removal</h3>
            <p style={o}>content</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestStylesRemoval_ssr', ret)

    return ret
}

TestStylesRemoval.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const value = $$(testObservables['TestStylesRemoval'])
        let expected
        if (value) {
            const styles = []
            for (const [prop, val] of Object.entries(value)) {
                const cssProp = prop.replace(/([A-Z])/g, '-$1').toLowerCase()
                styles.push(`${cssProp}: ${val};`)
            }
            expected = `<p style="${styles.join(' ')}">content</p>`
        } else {
            expected = '<p style="">content</p>'
        }

        // Test the SSR value
        const ssrComponent = testObservables['TestStylesRemoval_ssr']
        if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
            const ssrResult = renderToString(ssrComponent)
            let expectedFull
            if (value) {
                const styles = []
                for (const [prop, val] of Object.entries(value)) {
                    const cssProp = prop.replace(/([A-Z])/g, '-$1').toLowerCase()
                    styles.push(`${cssProp}: ${val};`)
                }
                expectedFull = `<h3>Styles - Removal</h3><p style="${styles.join(' ')}">content</p>`
            } else {
                expectedFull = '<h3>Styles - Removal</h3><p>content</p>'
            }
            if (ssrResult !== expectedFull) {
                assert(false, `[TestStylesRemoval] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
            } else {
                console.log(`✅ [TestStylesRemoval] SSR test passed: ${ssrResult}`)
            }
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestStylesRemoval} />