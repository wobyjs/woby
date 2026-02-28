import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestEventClickCaptureStatic = (): JSX.Element => {
    const o = $(0)
    const ref = $<HTMLButtonElement>()
    registerTestObservable('TestEventClickCaptureStatic_o', o)
    const increment = () => o(prev => prev + 1)

    // Register the ref for testing
    registerTestObservable('TestEventClickCaptureStatic_ref', ref)

    // Fire click events programmatically for testing
    useInterval(() => {
        const button = ref()
        if (button) {
            // For capture events, we need to trigger the handler directly
            if (button._onclickcapture) {
                const mockEvent = {
                    currentTarget: button,
                    target: button,
                    composedPath: () => [button, button.parentNode, document.body, document],
                    cancelBubble: false,
                    stopPropagation: () => { },
                    stopImmediatePropagation: () => { }
                }
                button._onclickcapture.call(button, mockEvent)
            }
        }
    }, TEST_INTERVAL)

    const ret: JSX.Element = (
        <>
            <h3>Event - Click Capture Static</h3>
            <p><button ref={ref} onClickCapture={increment}>{o}</button></p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestEventClickCaptureStatic_ssr', ret)

    return ret
}


TestEventClickCaptureStatic.test = {
    static: false,
    expect: () => {
        const value = $$(testObservables['TestEventClickCaptureStatic_o']) ?? 0

        // Define expected values for both main test and SSR test
        const expectedFull = `<h3>Event - Click Capture Static</h3><p><button>${value}</button></p>`  // For SSR comparison
        const expected = `<p><button>${value}</button></p>`   // For main test comparison

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestEventClickCaptureStatic_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                // If it's a JSX element or function, we can render it to string
                // If it's a function, we need to call it first to get the element
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    if (ssrResult !== expectedFull) {
                        assert(false, `[TestEventClickCaptureStatic] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
                    } else {
                        console.log(`✅ [TestEventClickCaptureStatic] SSR test passed: ${ssrResult}`)
                    }
                }).catch(err => {
                    console.error(`[TestEventClickCaptureStatic] SSR render error: ${err}`)
                })
            }
        }, 0)

        return expected
    }
}

export default () => <TestSnapshots Component={TestEventClickCaptureStatic} />