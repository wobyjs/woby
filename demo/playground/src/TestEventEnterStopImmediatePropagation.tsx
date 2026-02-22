import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

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
            const event = new PointerEvent('pointerenter')
            buttonOuter.dispatchEvent(event)
        }
        if (buttonInner) {
            const event = new PointerEvent('pointerenter')
            buttonInner.dispatchEvent(event)
        }
    }, TEST_INTERVAL)

    return (
        <>
            <h3>Event - Enter - Stop Immediate Propagation</h3>
            <p><button ref={refOuter} onPointerEnter={onEnterOuter}>{outer}<button ref={refInner} onPointerEnter={onEnterInner}>{inner}</button></button></p>
        </>
    )
}


TestEventEnterStopImmediatePropagation.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        if (testit) {
            return `<p><button>0<button>0</button></button></p>`
        }
        else {
            const outerValue = $$(testObservables['TestEventEnterStopImmediatePropagation_outer'])
            const innerValue = $$(testObservables['TestEventEnterStopImmediatePropagation_inner'])
            testit = true
            return `<p><button>${outerValue}<button>${innerValue}</button></button></p>`
        }
    }
}

export default () => <TestSnapshots Component={TestEventEnterStopImmediatePropagation} />