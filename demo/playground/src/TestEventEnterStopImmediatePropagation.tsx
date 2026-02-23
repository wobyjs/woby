import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

let testit = true
const TestEventEnterStopImmediatePropagation = (): JSX.Element => {
    const outer = $(0)
    const inner = $(0)
    const refOuter = $<HTMLButtonElement>()
    const refInner = $<HTMLButtonElement>()
    registerTestObservable('TestEventEnterStopImmediatePropagation_outer', outer)
    registerTestObservable('TestEventEnterStopImmediatePropagation_inner', inner)
    const onEnterOuter = $(() => { })
    const onEnterInner = $(() => { })
    
    const incrementOuter = () => {
        outer(prev => prev + 1)
        testit = false
    }
    
    const incrementInner = event => {
        event.stopImmediatePropagation()
        inner(prev => prev + 1)
        testit = false
    }
    
    onEnterOuter(() => incrementOuter)
    onEnterInner(() => incrementInner)

    // Fire enter events programmatically for testing
    useInterval(() => {
        const buttonOuter = refOuter()
        const buttonInner = refInner()
        if (buttonOuter) {
            const mockEvent = {
                currentTarget: buttonOuter,
                target: buttonOuter,
                composedPath: () => [buttonOuter, buttonOuter.parentNode, document.body, document],
                cancelBubble: false,
                stopPropagation: () => {},
                stopImmediatePropagation: () => {}
            };
            if (buttonOuter._onpointerenter) {
                buttonOuter._onpointerenter.call(buttonOuter, mockEvent);
            }
        }
        if (buttonInner) {
            const mockEvent = {
                currentTarget: buttonInner,
                target: buttonInner,
                composedPath: () => [buttonInner, buttonInner.parentNode, document.body, document],
                cancelBubble: false,
                stopPropagation: () => {},
                stopImmediatePropagation: () => {}
            };
            if (buttonInner._onpointerenter) {
                buttonInner._onpointerenter.call(buttonInner, mockEvent);
            }
        }
    }, TEST_INTERVAL)

    const ret: JSX.Element = (
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
    static: false,
    compareActualValues: true,
    expect: () => {
        let expected, expectedFull;
        if (testit) {
            expected = `<p><button>0<button>0</button></button></p>`
            expectedFull = `<h3>Event - Enter - Stop Immediate Propagation</h3><p><button>0<button>0</button></button></p>`
        }
        else {
            const outerValue = $$(testObservables['TestEventEnterStopImmediatePropagation_outer'])
            const innerValue = $$(testObservables['TestEventEnterStopImmediatePropagation_inner'])
            testit = true
            expected = `<p><button>${outerValue}<button>${innerValue}</button></button></p>`
            expectedFull = `<h3>Event - Enter - Stop Immediate Propagation</h3><p><button>${outerValue}<button>${innerValue}</button></button></p>`
        }
        
        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestEventEnterStopImmediatePropagation_ssr']
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

export default () => <TestSnapshots Component={TestEventEnterStopImmediatePropagation} />