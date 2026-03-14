import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const name = 'TestEventMiddleClickCaptureStatic'
const TestEventMiddleClickCaptureStatic = (): JSX.Element => {
    const o = $(0)
    const ref = $<HTMLButtonElement>()
    registerTestObservable(`${name}_o`, o)
    const increment = () => o(prev => prev + 1)

    // Register the ref for testing
    registerTestObservable(`${name}_ref`, ref)

    // Fire middle click events programmatically for testing
    useInterval(() => {
        const button = ref()
        if (button) {
            // For capture events, we need to trigger the handler directly
            // Middle click is button 1 in mouse events
            const mockEvent = {
                currentTarget: button,
                target: button,
                button: 1, // Middle mouse button
                composedPath: () => [button, button.parentNode, document.body, document],
                cancelBubble: false,
                stopPropagation: () => { },
                stopImmediatePropagation: () => { }
            }
            if (button._onauxclickcapture) {
                button._onauxclickcapture.call(button, mockEvent)
            }
        }
    }, TEST_INTERVAL)

    const ret: JSX.Element = () => (
        <>
            <h3>Event - Middle Click Capture Static</h3>
            <p><button ref={ref} onAuxClickCapture={increment}>{o}</button></p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}


TestEventMiddleClickCaptureStatic.test = {
    static: false,
    expect: () => {
        const value = testObservables[`${name}_o`]?.() ?? 0

        // Define expected values for both main test and SSR test
        const expectedFull = `<h3>Event - Middle Click Capture Static</h3><p><button>${value}</button></p>`  // For SSR comparison
        const expected = `<p><button>${value}</button></p>`   // For main test comparison

        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        if (ssrResult !== expectedFull) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ ${name}] SSR test passed: ${ssrResult}`)
        }

        // Verify the main test expectation with console assertion
        // Find the button within our specific test component
        const allH3 = document.querySelectorAll('h3')
        let buttonElement = null
        for (let h3 of allH3) {
            if (h3.textContent && h3.textContent.includes('Event - Middle Click Capture Static')) {
                buttonElement = h3.nextElementSibling?.querySelector('button')
                break
            }
        }
        if (buttonElement) {
            const buttonText = buttonElement.textContent || ''
            const currentExpected = `<p><button>${buttonText}</button></p>`
            console.assert(currentExpected === expected,
                `TestEventMiddleClickCaptureStatic expectation failed: got \n${currentExpected}, expected \n${expected}`)
            if (currentExpected === expected) {
                console.log(`✅ Expect function test passed for TestEventMiddleClickCaptureStatic  expect:  ${expected}`)
            }
        }

        return expected
    }
}

export default () => <TestSnapshots Component={TestEventMiddleClickCaptureStatic} />