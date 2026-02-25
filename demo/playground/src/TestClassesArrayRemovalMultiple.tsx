import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestClassesArrayRemovalMultiple = (): JSX.Element => {
    const o = $<FunctionUnwrap<JSX.Class> | null>(['red bold', false])
    // Store the observable globally so the test can access it
    registerTestObservable('TestClassesArrayRemovalMultiple', o)
    const toggle = () => o(prev => prev ? null : ['red bold', false])
    useInterval(toggle, TEST_INTERVAL)
    const ret: JSX.Element = (
        <>
            <h3>Classes - Array Removal Multiple</h3>
            <p class={o}>content</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestClassesArrayRemovalMultiple_ssr', ret)

    return ret
}

TestClassesArrayRemovalMultiple.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const value = $$(testObservables['TestClassesArrayRemovalMultiple'])
        let expected: string
        if (!value) expected = '<p class="">content</p>'
        else {
            const classes = Array.isArray(value) ? value.filter(v => v && v !== false).join(' ') : value
            expected = `<p class="${classes}">content</p>`
        }

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestClassesArrayRemovalMultiple_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    const expectedFull = value ? `<h3>Classes - Array Removal Multiple</h3>${expected}` : '<h3>Classes - Array Removal Multiple</h3><p>content</p>'
                    if (ssrResult !== expectedFull) {
                        assert(false, `[TestClassesArrayRemovalMultiple] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
                    } else {
                        console.log(`✅ [TestClassesArrayRemovalMultiple] SSR test passed: ${ssrResult}`)
                    }
                }).catch(err => {
                    console.error(`[TestClassesArrayRemovalMultiple] SSR render error: ${err}`)
                })
            }
        }, 0)

        return expected
    }
}


export default () => <TestSnapshots Component={TestClassesArrayRemovalMultiple} />