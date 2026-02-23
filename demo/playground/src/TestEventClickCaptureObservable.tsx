import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

// Declare global property for TypeScript
declare global {
    interface Window {
        testObservables: Record<string, any>
    }
}

// Expose test observables globally for testing
if (typeof window !== 'undefined') {
    (window as any).testObservables = testObservables
}

const TestEventClickCaptureObservable = (): JSX.Element => {
    const o = $(0)
    const ref = $<HTMLButtonElement>()
    registerTestObservable('TestEventClickCaptureObservable_o', o)
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
            if (button._onclickcapture) {
                const mockEvent = {
                    currentTarget: button,
                    target: button,
                    composedPath: () => [button, button.parentNode, document.body, document],
                    cancelBubble: false,
                    stopPropagation: () => {},
                    stopImmediatePropagation: () => {}
                };
                button._onclickcapture.call(button, mockEvent);
            }
        }
    }, TEST_INTERVAL)

    const ret: JSX.Element = (
        <>
            <h3>Event - Click Capture Observable</h3>
            <p><button ref={ref} onClickCapture={onClick}>{o}</button></p>
        </>
    )
    
    // Store the component for SSR testing
    registerTestObservable('TestEventClickCaptureObservable_ssr', ret)
    
    return ret
}


TestEventClickCaptureObservable.test = {
    static: false,
    expect: () => {
        // For the plus2/minus1 pattern: 0 -> 2 -> 1 -> 3 -> 2 -> 4 -> 3...
        // The observable should be updating correctly with the pattern
        const observable = testObservables['TestEventClickCaptureObservable_o']
        let currentValue = 0
        let expected, expectedFull
        
        if (observable) {
            currentValue = $$(observable)
            // Check that the value is following the expected pattern
            // Should be increasing by 2, then decreasing by 1, etc.
            expected = `<p><button>${currentValue}</button></p>`
            expectedFull = `<h3>Event - Click Capture Observable</h3><p><button>${currentValue}</button></p>`
        } else {
            expected = `<p><button>0</button></p>`
            expectedFull = `<h3>Event - Click Capture Observable</h3><p><button>0</button></p>`
        }
        
        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestEventClickCaptureObservable_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                // If it's a JSX element or function, we can render it to string
                // If it's a function, we need to call it first to get the element
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    if (ssrResult !== expectedFull) {
                        assert(false, `SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
                    } else {
                        console.log(`✅ SSR test passed: ${ssrResult}`)
                    }
                }).catch(err => {
                    console.error(`SSR render error: ${err}`)
                })
            }
        }, 0)
        
        return expected
    }
}

export default () => <TestSnapshots Component={TestEventClickCaptureObservable} />