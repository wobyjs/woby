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

// Conditional: SSR tests (Node.js environment - tsx mode)
if (typeof window === 'undefined') {
    TestClassesObjectRemovalMultiple()
    const ssrComponent = testObservables[`${name}_ssr`]
    const ssrResult = renderToString(ssrComponent)
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
    const expectedFull = value ?
        `<h3>Classes - Object Removal Multiple</h3>${expected}` :
        '<h3>Classes - Object Removal Multiple</h3><p>content</p>'
    const passed = ssrResult === expectedFull
    console.log(`\n📝 Test: ${name}\n   SSR: ${ssrResult} ${passed ? '✅' : '❌'}\n`)
    if (!passed) { console.error(`❌ [${name}] failed`); process.exit(1) }
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

        return expected
    }
}


export default () => <TestSnapshots Component={TestClassesObjectRemovalMultiple} />