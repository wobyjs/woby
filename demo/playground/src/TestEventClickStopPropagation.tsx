import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

let testit = true
const TestEventClickStopPropagation = (): JSX.Element => {
    const outer = $(0)
    const inner = $(0)
    const refOuter = $<HTMLButtonElement>()
    const refInner = $<HTMLButtonElement>()
    registerTestObservable('TestEventClickStopPropagation_outer', outer)
    registerTestObservable('TestEventClickStopPropagation_inner', inner)
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
    registerTestObservable('TestEventClickStopPropagation_ssr', ret)

    return ret
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
            const outerValue = $$(testObservables['TestEventClickStopPropagation_outer'])
            const innerValue = $$(testObservables['TestEventClickStopPropagation_inner'])
            testit = true
            expected = `<p><button>${outerValue}<button>${innerValue}</button></button></p>`
            expectedFull = `<h3>Event - Click - Stop Propagation</h3><p><button>${outerValue}<button>${innerValue}</button></button></p>`
        }

        const ssrComponent = testObservables['TestEventClickStopPropagation_ssr']
        const ssrResult = renderToString(ssrComponent)
        if (ssrResult !== expectedFull) {
            assert(false, `[TestEventClickStopPropagation] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [TestEventClickStopPropagation] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}

export default () => <TestSnapshots Component={TestEventClickStopPropagation} />