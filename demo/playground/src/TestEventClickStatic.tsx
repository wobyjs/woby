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

    const ret: JSX.Element = (
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
        const expectedFull = `<h3>Event - Click Static</h3><p><button>${value}</button></p>`  // For SSR comparison
        const expected = `<p><button>${value}</button></p>`   // For main test comparison

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestEventClickStatic_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                // If it's a JSX element or function, we can render it to string
                // If it's a function, we need to call it first to get the element
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    if (ssrResult !== expectedFull) {
                        assert(false, `[TestEventClickStatic] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
                    } else {
                        console.log(`✅ [TestEventClickStatic] SSR test passed: ${ssrResult}`)
                    }
                }).catch(err => {
                    console.error(`[TestEventClickStatic] SSR render error: ${err}`)
                })
            }
        }, 0)

        return expected
    }
}

export default () => <TestSnapshots Component={TestEventClickStatic} />