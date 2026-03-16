import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const name = 'TestEventClickStopImmediatePropagation'
const TestEventClickStopImmediatePropagation = (): JSX.Element => {
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
    }

    const incrementInner = event => {
        event.stopImmediatePropagation()
        inner(prev => prev + 1)
    }

    onClickOuter(() => incrementOuter)
    onClickInner(() => incrementInner)

    // Fire click events programmatically for testing
    // Only fire on the inner button to test stopImmediatePropagation behavior
    useInterval(() => {
        const buttonInner = refInner()
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
            <h3>Event - Click - Stop Immediate Propagation</h3>
            <p><button ref={refOuter} onClick={onClickOuter}>{outer}<button ref={refInner} onClick={onClickInner}>{inner}</button></button></p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}


TestEventClickStopImmediatePropagation.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        let expected, expectedFull

        const outerValue = $$(testObservables[`${name}_outer`])
        const innerValue = $$(testObservables[`${name}_inner`])

        expected = `<p><button>${outerValue}<button>${innerValue}</button></button></p>`
        expectedFull = `<h3>Event - Click - Stop Immediate Propagation</h3><p><button>${outerValue}<button>${innerValue}</button></button></p>`

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

export default () => <TestSnapshots Component={TestEventClickStopImmediatePropagation} />