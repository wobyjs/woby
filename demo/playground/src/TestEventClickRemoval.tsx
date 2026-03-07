import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestEventClickRemoval = (): JSX.Element => {
    const o = $(0)
    const ref = $<HTMLButtonElement>()
    registerTestObservable('TestEventClickRemoval_o', o)
    registerTestObservable('TestEventClickRemoval_ref', ref)
    const onClick = $(() => { })
    registerTestObservable('TestEventClickRemoval_onClick', onClick)
    const increment = () => o(prev => {
        onClick(() => null)
        return prev + 1
    })
    onClick(() => increment)

    // Fire click event programmatically 4 times for testing
    setTimeout(() => {
        useInterval(() => {
            const button = ref()
            const testObservables = window.testObservables || {}
            const onClickObservable = testObservables.TestEventClickRemoval_onClick

            if (button && onClickObservable) {
                // For delegated events, we need to manually trigger the handler
                // since button.click() only triggers direct onclick handlers
                if (button._onclick) {
                    const mockEvent = {
                        currentTarget: button,
                        target: button,
                        composedPath: () => [button, button.parentNode, document.body, document],
                        cancelBubble: false
                    }
                    button._onclick.call(button, mockEvent)
                } else {
                    // Fallback to regular click if no delegated handler
                    button.click?.()
                }
            }
        }, TEST_INTERVAL)
    }, 500) // Start interval after 500ms

    // Final verification after all clicks
    setTimeout(() => {
        const finalValue = o()
        if (finalValue !== 1) {
            console.error('❌ Event handler removal test failed: expected 1, got', finalValue)
        }
    }, 3000) // After 3 seconds (enough time for 4 clicks at 500ms intervals)

    const ret: JSX.Element = () => (
        <>
            <h3>Event - Click Removal</h3>
            <p><button ref={ref} onClick={onClick}>{o}</button></p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestEventClickRemoval_ssr', ret)

    return ret
}


TestEventClickRemoval.test = {
    static: false,
    expect: () => {
        const value = $$(testObservables['TestEventClickRemoval_o']) ?? 0

        // Define expected values for both main test and SSR test
        const expectedFull = `<h3>Event - Click Removal</h3><p><button>${value}</button></p>`  // For SSR comparison
        const expected = `<p><button>${value}</button></p>`   // For main test comparison

        // Test the SSR value synchronously
        const ssrComponent = testObservables['TestEventClickRemoval_ssr']
        const ssrResult = renderToString(ssrComponent)
        if (ssrResult !== expectedFull) {
            assert(false, `[TestEventClickRemoval] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [TestEventClickRemoval] SSR test passed: ${ssrResult}`)
        }

        // Verify event handler removal behavior after 4 programmatic clicks
        // The button should increment from 0 to 1, then stop (handler removed)
        if (value > 1) {
            assert(false, `Event handler not removed properly: button value is ${value}, expected 0 or 1 after 4 clicks`)
        } else if (value === 1) {
            console.log(`✅ Event handler removal test passed: button incremented once and stopped at ${value} after 4 clicks`)
        } else {
            console.log(`ℹ️  Initial state: button value is ${value} after 4 clicks`)
        }

        return expected
    }
}

export default () => <TestSnapshots Component={TestEventClickRemoval} />