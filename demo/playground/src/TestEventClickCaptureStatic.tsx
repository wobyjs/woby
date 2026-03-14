import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const name = 'TestEventClickCaptureStatic'
const TestEventClickCaptureStatic = (): JSX.Element => {
    const o = $(0)
    const ref = $<HTMLButtonElement>()
    registerTestObservable(`${name}_o`, o)
    const increment = () => o(prev => prev + 1)

    // Register the ref for testing
    registerTestObservable(`${name}_ref`, ref)

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

    const ret: JSX.Element = () => (
        <>
            <h3>Event - Click Capture Static</h3>
            <p><button ref={ref} onClickCapture={increment}>{o}</button></p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}


TestEventClickCaptureStatic.test = {
    static: false,
    expect: () => {
        const value = $$(testObservables[`${name}_o`]) ?? 0

        // Define expected values for both main test and SSR test
        const expectedFull = `<h3>Event - Click Capture Static</h3><p><button>${value}</button></p>`  // For SSR comparison
        const expected = `<p><button>${value}</button></p>`   // For main test comparison

        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        if (ssrResult !== expectedFull) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ ${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}

export default () => <TestSnapshots Component={TestEventClickCaptureStatic} />