import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestEventEnterStopImmediatePropagation = (): JSX.Element => {
    const outer = $(0)
    const inner = $(0)
    const refOuter = $<HTMLButtonElement>()
    const refInner = $<HTMLButtonElement>()
    registerTestObservable('TestEventEnterStopImmediatePropagation_outer', outer)
    registerTestObservable('TestEventEnterStopImmediatePropagation_inner', inner)
    const onEnterOuter = $(() => { })
    const onEnterInner = $(() => { })

    // Register refs for testing
    registerTestObservable('TestEventEnterStopImmediatePropagation_refOuter', refOuter)
    registerTestObservable('TestEventEnterStopImmediatePropagation_refInner', refInner)

    const incrementOuter = () => {
        outer(prev => prev + 1)
    }

    const incrementInner = event => {
        event.stopImmediatePropagation()
        inner(prev => prev + 1)
    }

    onEnterOuter(() => incrementOuter)
    onEnterInner(() => incrementInner)

    // Fire enter events programmatically for testing
    // Only fire on the inner button to test stopImmediatePropagation behavior
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
            if (buttonInner._onpointerenter) {
                buttonInner._onpointerenter.call(buttonInner, mockEvent)
            }
        }
    }, TEST_INTERVAL)

    const ret: JSX.Element = () => (
        <>
            <h3>Event - Enter - Stop Immediate Propagation</h3>
            <p><button ref={refOuter} onPointerEnter={onEnterOuter}>{outer}<button ref={refInner} onPointerEnter={onEnterInner}>{inner}</button></button></p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestEventEnterStopImmediatePropagation_ssr', ret)

    return ret
}


TestEventEnterStopImmediatePropagation.test = {
    static: true,
    compareActualValues: true,
    expect: () => {
        let expected, expectedFull

        const outerValue = $$(testObservables['TestEventEnterStopImmediatePropagation_outer'])
        const innerValue = $$(testObservables['TestEventEnterStopImmediatePropagation_inner'])
        expected = `<p><button>${outerValue}<button>${innerValue}</button></button></p>`
        expectedFull = `<h3>Event - Enter - Stop Immediate Propagation</h3><p><button>${outerValue}<button>${innerValue}</button></button></p>`

        const ssrComponent = testObservables['TestEventEnterStopImmediatePropagation_ssr']
        const ssrResult = renderToString(ssrComponent)
        if (ssrResult !== expectedFull) {
            assert(false, `[TestEventEnterStopImmediatePropagation] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestEventEnterStopImmediatePropagation] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}

export default () => <TestSnapshots Component={TestEventEnterStopImmediatePropagation} />