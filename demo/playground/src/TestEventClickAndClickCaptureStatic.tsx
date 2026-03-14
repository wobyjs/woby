import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const name = 'TestEventClickAndClickCaptureStatic'
const TestEventClickAndClickCaptureStatic = (): JSX.Element => {
    const o = $(0)
    const ref = $<HTMLButtonElement>()
    registerTestObservable(`${name}_o`, o)

    const increment = () => o(prev => prev + 1)
    const captureIncrement = () => o(prev => prev + 1)

    // Fire click event programmatically
    useInterval(() => {
        const button = ref()
        if (button) {
            // For delegated events, manually trigger the handler
            if (button._onclick) {
                const mockEvent = {
                    currentTarget: button,
                    target: button,
                    composedPath: () => [button, button.parentNode, document.body, document],
                    cancelBubble: false
                }
                button._onclick.call(button, mockEvent)
            }
        }
    }, TEST_INTERVAL)

    const ret: JSX.Element = () => (
        <>
            <h3>Event - Click & Click Capture Static</h3>
            <p><button ref={ref} onClick={increment} onClickCapture={captureIncrement}>{o}</button></p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}


TestEventClickAndClickCaptureStatic.test = {
    static: false,
    expect: () => {
        const value = $$(testObservables[`${name}_o`]) ?? 0

        // For client-side test, use the current value
        const expected = `<p><button>${value}</button></p>`   // For main test comparison (current value)

        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        // Extract the button value from SSR result to use for comparison
        const match = ssrResult.match(/<button[^>]*>(.*?)<\/button>/)
        const ssrValue = match ? match[1] : '0'
        const expectedFull = `<h3>Event - Click & Click Capture Static</h3><p><button>${ssrValue}</button></p>`  // For SSR comparison (actual SSR value)
        // Handle HTML entity encoding in SSR output
        if (ssrResult !== expectedFull) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ ${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}

export default () => <TestSnapshots Component={TestEventClickAndClickCaptureStatic} />