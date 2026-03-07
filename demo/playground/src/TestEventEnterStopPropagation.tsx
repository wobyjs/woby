import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'


const TestEventEnterStopPropagation = (): JSX.Element => {
    const outer = $(0)
    const inner = $(0)
    const refOuter = $<HTMLButtonElement>()
    const refInner = $<HTMLButtonElement>()
    registerTestObservable('TestEventEnterStopPropagation_outer', outer)
    registerTestObservable('TestEventEnterStopPropagation_inner', inner)

    // Register refs for testing
    registerTestObservable('TestEventEnterStopPropagation_refOuter', refOuter)
    registerTestObservable('TestEventEnterStopPropagation_refInner', refInner)

    const incrementOuter = () => outer(prev => prev + 1)

    const incrementInner = event => {
        event.stopPropagation()
        inner(prev => prev + 1)
    }

    // Fire enter events programmatically for testing
    // Only fire on the inner button to test stopPropagation behavior
    useInterval(() => {
        const buttonInner = refInner()
        if (buttonInner) {
            const mockEvent = {
                currentTarget: buttonInner,
                target: buttonInner,
                composedPath: () => [buttonInner, buttonInner.parentNode, document.body, document],
                cancelBubble: false,
                stopPropagation: () => { },
                stopImmediatePropagation: () => { }
            }
            if (buttonInner._onmouseenter) {
                buttonInner._onmouseenter.call(buttonInner, mockEvent)
            }
        }
    }, TEST_INTERVAL)

    const ret: JSX.Element = () => (
        <>
            <h3>Event - Enter - Stop Propagation</h3>
            <p><button ref={refOuter} onMouseEnter={incrementOuter}>{outer}<button ref={refInner} onMouseEnter={incrementInner}>{inner}</button></button></p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestEventEnterStopPropagation_ssr', ret)

    return ret
}


TestEventEnterStopPropagation.test = {
    static: true,
    compareActualValues: true,
    expect: () => {
        let expected, expectedFull

        const outerValue = $$(testObservables['TestEventEnterStopPropagation_outer'])
        const innerValue = $$(testObservables['TestEventEnterStopPropagation_inner'])
        expected = `<p><button>${outerValue}<button>${innerValue}</button></button></p>`
        expectedFull = `<h3>Event - Enter - Stop Propagation</h3><p><button>${outerValue}<button>${innerValue}</button></button></p>`

        const ssrComponent = testObservables['TestEventEnterStopPropagation_ssr']
        const ssrResult = renderToString(ssrComponent)
        if (ssrResult !== expectedFull) {
            assert(false, `[TestEventEnterStopPropagation] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [TestEventEnterStopPropagation] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}

export default () => <TestSnapshots Component={TestEventEnterStopPropagation} />