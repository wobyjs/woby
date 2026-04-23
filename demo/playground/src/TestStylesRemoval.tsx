import { $, $$, renderToString, type JSX } from 'woby'
import type { FunctionUnwrap } from './util'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const name = 'TestStylesRemoval'
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
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}


// Conditional: SSR tests (Node.js environment - tsx mode)
if (typeof window === 'undefined') {
    TestStylesRemoval()
    const ssrComponent = testObservables[`TestStylesRemoval_ssr`]
    if (ssrComponent) {
        const ssrResult = renderToString(ssrComponent)
        console.log(`\n📝 Test: TestStylesRemoval\n   SSR: ${ssrResult} ✅\n`)
    }
}

TestStylesRemoval.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const value = $$(testObservables[name])
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
        const ssrComponent = testObservables[`${name}_ssr`]
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
                assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
            } else {
                console.log(`✅ [${name}] SSR test passed: ${ssrResult}`)
            }
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestStylesRemoval} />