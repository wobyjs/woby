import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestEventClickCaptureRemoval = (): JSX.Element => {
    const o = $(0)
    const ref = $<HTMLButtonElement>()
    registerTestObservable('TestEventClickCaptureRemoval_o', o)
    const onClick = $(() => { })
    const increment = () => o(prev => {
        onClick(() => null)
        return prev + 1
    })
    onClick(() => increment)

    // Register the ref for testing
    registerTestObservable('TestEventClickCaptureRemoval_ref', ref)
    registerTestObservable('TestEventClickCaptureRemoval_onClick', onClick)

    // Fire click event programmatically for testing
    useInterval(() => {
        const button = ref()
        if (button) {
            // For delegated events, manually trigger the handler
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
            <h3>Event - Click Capture Removal</h3>
            <p><button ref={ref} onClickCapture={onClick}>{o}</button></p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestEventClickCaptureRemoval_ssr', ret)

    return ret
}


TestEventClickCaptureRemoval.test = {
    static: false,
    expect: () => {
        const value = testObservables['TestEventClickCaptureRemoval_o']?.() ?? 0

        // Define expected values for both main test and SSR test
        const expectedFull = `<h3>Event - Click Capture Removal</h3><p><button>${value}</button></p>`  // For SSR comparison
        const expected = `<p><button>${value}</button></p>`   // For main test comparison

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestEventClickCaptureRemoval_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                // If it's a JSX element or function, we can render it to string
                // If it's a function, we need to call it first to get the element
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    if (ssrResult !== expectedFull) {
                        assert(false, `[TestEventClickCaptureRemoval] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
                    } else {
                        console.log(`✅ [TestEventClickCaptureRemoval] SSR test passed: ${ssrResult}`)
                    }
                }).catch(err => {
                    console.error(`[TestEventClickCaptureRemoval] SSR render error: ${err}`)
                })
            }
        }, 0)

        return expected
    }
}

export default () => <TestSnapshots Component={TestEventClickCaptureRemoval} />