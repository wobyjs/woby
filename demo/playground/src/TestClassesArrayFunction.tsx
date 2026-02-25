import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestClassesArrayFunction = (): JSX.Element => {
    const o = $(['red', false])
    // Store the observable globally so the test can access it
    registerTestObservable('TestClassesArrayFunction', o)
    const toggle = () => o(prev => prev[0] ? [false, 'blue'] : ['red', false])
    useInterval(toggle, TEST_INTERVAL)
    const ret: JSX.Element = (
        <>
            <h3>Classes - Array Function</h3>
            <p class={() => o()}>content</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestClassesArrayFunction_ssr', ret)

    return ret
}

TestClassesArrayFunction.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const value = $$(testObservables['TestClassesArrayFunction'])
        const classes = Array.isArray(value) ? value.filter(v => v && v !== false).join(' ') : (value || '')

        // Define expected values for both main test and SSR test
        const expectedFull = `<h3>Classes - Array Function</h3><p class="${classes}">content</p>`  // For SSR comparison
        const expected = `<p class="${classes}">content</p>`   // For main test comparison

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestClassesArrayFunction_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                // If it's a JSX element or function, we can render it to string
                // If it's a function, we need to call it first to get the element
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    if (ssrResult !== expectedFull) {
                        assert(false, `[TestClassesArrayFunction] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
                    } else {
                        console.log(`✅ [TestClassesArrayFunction] SSR test passed: ${ssrResult}`)
                    }
                }).catch(err => {
                    console.error(`[TestClassesArrayFunction] SSR render error: ${err}`)
                })
            }
        }, 0)

        return expected
    }
}


export default () => <TestSnapshots Component={TestClassesArrayFunction} />