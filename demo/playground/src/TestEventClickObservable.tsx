import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestEventClickObservable = (): JSX.Element => {
    const o = $(0)
    const ref = $<HTMLButtonElement>()
    registerTestObservable('TestEventClickObservable_o', o)
    const onClick = $(() => { })
    const plus2 = () => o(prev => {
        onClick(() => minus1)
        return prev + 2
    })
    const minus1 = () => o(prev => {
        onClick(() => plus2)
        return prev - 1
    })
    onClick(() => plus2)

    // Fire click event programmatically for testing
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
            <h3>Event - Click Observable</h3>
            <p><button ref={ref} onClick={onClick}>{o}</button></p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestEventClickObservable_ssr', ret)

    return ret
}


TestEventClickObservable.test = {
    static: false,
    expect: () => {
        const value = testObservables['TestEventClickObservable_o']?.() ?? 0

        // Define expected values for both main test and SSR test
        const expectedFull = `<h3>Event - Click Observable</h3><p><button>${value}</button></p>`  // For SSR comparison
        const expected = `<p><button>${value}</button></p>`   // For main test comparison

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestEventClickObservable_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                // If it's a JSX element or function, we can render it to string
                // If it's a function, we need to call it first to get the element
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    if (ssrResult !== expectedFull) {
                        assert(false, `[TestEventClickObservable] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
                    } else {
                        console.log(`✅ [TestEventClickObservable] SSR test passed: ${ssrResult}`)
                    }
                }).catch(err => {
                    console.error(`[TestEventClickObservable] SSR render error: ${err}`)
                })
            }
        }, 0)

        return expected
    }
}

export default () => <TestSnapshots Component={TestEventClickObservable} />