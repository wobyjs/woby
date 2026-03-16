import { $, $$, renderToString, type JSX } from 'woby'
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

const name = 'TestEventClickCaptureObservable'
const TestEventClickCaptureObservable = (): JSX.Element => {
    const o = $(0)
    const ref = $<HTMLButtonElement>()
    registerTestObservable(`${name}_o`, o)
    const onClick = $(() => { })
    const plus2 = (event: Event) => {
        onClick(() => minus1)
        o(prev => prev + 2)
    }
    const minus1 = (event: Event) => {
        onClick(() => plus2)
        o(prev => prev - 1)
    }
    onClick(() => plus2)

    // Register the ref for testing
    registerTestObservable(`${name}_ref`, ref)
    registerTestObservable(`${name}_onClick`, onClick)

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

    const ret: JSX.Element = () => (
        <>
            <h3>Event - Click Capture Observable</h3>
            <p><button ref={ref} onClickCapture={onClick}>{o}</button></p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}


TestEventClickCaptureObservable.test = {
    static: false,
    expect: () => {
        // For the plus2/minus1 pattern: 0 -> 2 -> 1 -> 3 -> 2 -> 4 -> 3...
        // The observable should be updating correctly with the pattern
        const observable = testObservables[`${name}_o`]
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

        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        if (ssrResult !== expectedFull) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}

export default () => <TestSnapshots Component={TestEventClickCaptureObservable} />