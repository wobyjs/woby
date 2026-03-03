import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestEventClickStatic = (): JSX.Element => {
    const o = $(0)
    const ref = $<HTMLButtonElement>()
    registerTestObservable('TestEventClickStatic_o', o)
    const increment = () => o(prev => prev + 1)

    // Programmatic click firing
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
            <h3>Event - Click Static</h3>
            <p><button ref={ref} onClick={increment}>{o}</button></p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestEventClickStatic_ssr', ret)

    return ret
}


TestEventClickStatic.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const value = $$(testObservables['TestEventClickStatic_o'])

        // Define expected values for both main test and SSR test
        const expected = `<p><button>${value}</button></p>`   // For main test comparison

        const ssrComponent = testObservables['TestEventClickStatic_ssr']
        const ssrResult = renderToString(ssrComponent)
        // Extract the button value from SSR result to use for comparison
        const match = ssrResult.match(/<button[^>]*>(.*?)<\/button>/)
        const ssrValue = match ? match[1] : '0'
        const expectedFull = `<h3>Event - Click Static</h3><p><button>${ssrValue}</button></p>`  // For SSR comparison
        if (ssrResult !== expectedFull) {
            assert(false, `[TestEventClickStatic] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestEventClickStatic] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}

export default () => <TestSnapshots Component={TestEventClickStatic} />