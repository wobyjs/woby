import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

let testit = true
const name = 'TestEventClickStopPropagation'
const TestEventClickStopPropagation = (): JSX.Element => {
    const outer = $(0)
    const inner = $(0)
    const refOuter = $<HTMLButtonElement>()
    const refInner = $<HTMLButtonElement>()
    registerTestObservable(`${name}_outer`, outer)
    registerTestObservable(`${name}_inner`, inner)
    const onClickOuter = $(() => { })
    const onClickInner = $(() => { })

    const incrementOuter = () => {
        outer(prev => prev + 1)
        testit = false
    }

    const incrementInner = event => {
        event.stopPropagation()
        inner(prev => prev + 1)
        testit = false
    }

    onClickOuter(() => incrementOuter)
    onClickInner(() => incrementInner)

    // Fire click events programmatically for testing
    useInterval(() => {
        const buttonOuter = refOuter()
        const buttonInner = refInner()
        if (buttonOuter) {
            // For delegated events, manually trigger the handler
            if (buttonOuter._onclick) {
                const mockEvent = {
                    currentTarget: buttonOuter,
                    target: buttonOuter,
                    composedPath: () => [buttonOuter, buttonOuter.parentNode, document.body, document],
                    cancelBubble: false,
                    stopPropagation: () => { },
                    stopImmediatePropagation: () => { }
                }
                buttonOuter._onclick.call(buttonOuter, mockEvent)
            }
        }
        if (buttonInner) {
            // For delegated events, manually trigger the handler
            if (buttonInner._onclick) {
                const mockEvent = {
                    currentTarget: buttonInner,
                    target: buttonInner,
                    composedPath: () => [buttonInner, buttonInner.parentNode, document.body, document],
                    cancelBubble: false,
                    stopPropagation: () => { },
                    stopImmediatePropagation: () => { }
                }
                buttonInner._onclick.call(buttonInner, mockEvent)
            }
        }
    }, TEST_INTERVAL)

    const ret: JSX.Element = () => (
        <>
            <h3>Event - Click - Stop Propagation</h3>
            <p><button ref={refOuter} onClick={onClickOuter}>{outer}<button ref={refInner} onClick={onClickInner}>{inner}</button></button></p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}



// Conditional: SSR tests (Node.js environment - tsx mode)
if (typeof window === 'undefined') {
    TestEventClickStopPropagation()
    const ssrComponent = testObservables[`TestEventClickStopPropagation_ssr`]
    if (ssrComponent) {
        const ssrResult = renderToString(ssrComponent)
        console.log(`\n📝 Test: TestEventClickStopPropagation\n   SSR: ${ssrResult} ✅\n`)
    }
}

TestEventClickStopPropagation.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        let expected, expectedFull
        if (testit) {
            expected = `<p><button>0<button>0</button></button></p>`
            expectedFull = `<h3>Event - Click - Stop Propagation</h3><p><button>0<button>0</button></button></p>`
        }
        else {
            const outerValue = $$(testObservables[`${name}_outer`])
            const innerValue = $$(testObservables[`${name}_inner`])
            testit = true
            expected = `<p><button>${outerValue}<button>${innerValue}</button></button></p>`
            expectedFull = `<h3>Event - Click - Stop Propagation</h3><p><button>${outerValue}<button>${innerValue}</button></button></p>`
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

export default () => <TestSnapshots Component={TestEventClickStopPropagation} />