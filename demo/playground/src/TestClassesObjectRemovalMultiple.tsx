import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestClassesObjectRemovalMultiple = (): JSX.Element => {
    const o = $<FunctionUnwrap<JSX.Class> | null>({ 'red bold': true, blue: false })
    // Store the observable globally so the test can access it
    registerTestObservable('TestClassesObjectRemovalMultiple', o)
    const toggle = () => o(prev => prev ? null : { 'red bold': true, blue: false })
    useInterval(toggle, TEST_INTERVAL)
    const ret: JSX.Element = (
        <>
            <h3>Classes - Object Removal Multiple</h3>
            <p class={o}>content</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestClassesObjectRemovalMultiple_ssr', ret)

    return ret
}

TestClassesObjectRemovalMultiple.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const value = $$(testObservables['TestClassesObjectRemovalMultiple'])
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

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestClassesObjectRemovalMultiple_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    // Log the actual SSR result for debugging
                    console.log(`[TestClassesObjectRemovalMultiple] SSR result: ${ssrResult}`)

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
                        assert(false, `[TestClassesObjectRemovalMultiple] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
                    } else {
                        console.log(`✅ [TestClassesObjectRemovalMultiple] SSR test passed: ${ssrResult}`)
                    }
                }).catch(err => {
                    console.error(`[TestClassesObjectRemovalMultiple] SSR render error: ${err}`)
                })
            }
        }, 0)

        return expected
    }
}


export default () => <TestSnapshots Component={TestClassesObjectRemovalMultiple} />