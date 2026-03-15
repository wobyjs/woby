import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const name = 'TestClassesObjectRemovalMultiple'
const TestClassesObjectRemovalMultiple = (): JSX.Element => {
    const o = $<FunctionUnwrap<JSX.Class> | null>({ 'red bold': true, blue: false })
    // Store the observable globally so the test can access it
    registerTestObservable('TestClassesObjectRemovalMultiple', o)
    const toggle = () => o(prev => prev ? null : { 'red bold': true, blue: false })
    useInterval(toggle, TEST_INTERVAL)
    const ret: JSX.Element = () => (
        <>
            <h3>Classes - Object Removal Multiple</h3>
            <p class={o}>content</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}

TestClassesObjectRemovalMultiple.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const value = $$(testObservables[name])
        let expected: string
        if (value) {
            const classes = []
            for (const [className, condition] of Object.entries(value)) {
                if (condition) {
                    classes.push(className)
                }
            }
            expected = `<p class="${classes.join(' ')}">content</p>`
        } else {
            expected = '<p class="">content</p>'
        }

        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        // Log the actual SSR result for debugging
        console.log(`[${name}] SSR result: ${ssrResult}`)

        let expectedFull: string
        if (value) {
            expectedFull = `<h3>Classes - Object Removal Multiple</h3>${expected}`
        } else {
            expectedFull = '<h3>Classes - Object Removal Multiple</h3><p>content</p>'
        }
        if (ssrResult !== expectedFull) {
            console.error(`❌ SSR test failed:`)
            console.error(`  Got: ${ssrResult}`)
            console.error(`  Expected: ${expectedFull}`)
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestClassesObjectRemovalMultiple} />