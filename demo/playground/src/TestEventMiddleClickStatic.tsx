import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestEventMiddleClickStatic = (): JSX.Element => {
    const o = $(0)
    const ref = $<HTMLButtonElement>()
    registerTestObservable('TestEventMiddleClickStatic_o', o)
    const increment = () => o(prev => prev + 1)

    // Register the ref for testing
    registerTestObservable('TestEventMiddleClickStatic_ref', ref)

    // Fire click events programmatically for testing
    useInterval(() => {
        const button = ref()
        if (button) {
            const mockEvent = {
                currentTarget: button,
                target: button,
                button: 1, // Middle mouse button
                composedPath: () => [button, button.parentNode, document.body, document],
                cancelBubble: false,
                stopPropagation: () => { },
                stopImmediatePropagation: () => { }
            }
            const buttonWithInternalHandlers = button as any
            if (buttonWithInternalHandlers._onauxclick) {
                buttonWithInternalHandlers._onauxclick.call(button, mockEvent)
            }
        }
    }, TEST_INTERVAL)

    const ret: JSX.Element = () => (
        <>
            <h3>Event - Middle Click</h3>
            <p><button ref={ref} onAuxClick={increment}>{o}</button></p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestEventMiddleClickStatic_ssr', ret)

    return ret
}


TestEventMiddleClickStatic.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const value = $$(testObservables['TestEventMiddleClickStatic_o']) ?? 0

        // Define expected values for both main test and SSR test
        const expected = `<p><button>${value}</button></p>`   // For main test comparison

        const ssrComponent = testObservables['TestEventMiddleClickStatic_ssr']
        const ssrResult = renderToString(ssrComponent)
        // Extract the button value from SSR result to use for comparison
        const match = ssrResult.match(/<button[^>]*>(.*?)<\/button>/)
        const ssrValue = match ? match[1] : '0'
        const expectedFull = `<h3>Event - Middle Click</h3><p><button>${ssrValue}</button></p>`  // For SSR comparison
        if (ssrResult !== expectedFull) {
            assert(false, `[TestEventMiddleClickStatic] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [TestEventMiddleClickStatic] SSR test passed: ${ssrResult}`)
        }

        // For dynamic test, return the current value
        return expected
    }
}

export default () => <TestSnapshots Component={TestEventMiddleClickStatic} />