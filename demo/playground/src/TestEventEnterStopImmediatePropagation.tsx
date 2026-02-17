import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

let testit = true
const TestEventEnterStopImmediatePropagation = (): JSX.Element => {
    const outer = $(0)
    const inner = $(0)
    const ref = $<HTMLButtonElement>()
    const refInner = $<HTMLButtonElement>()
    registerTestObservable('TestEventEnterStopImmediatePropagation_outer', outer)
    registerTestObservable('TestEventEnterStopImmediatePropagation_inner', inner)
    const incrementOuter = () => {
        outer(prev => prev + 1)
        testit = false
    }
    const incrementInner = event => {
        event.stopImmediatePropagation()
        inner(prev => prev + 1)
        testit = false
    }

    // Programmatic event firing
    useInterval(() => {
        const button = ref()
        const innerButton = refInner()
        if (button) {
            const event = new PointerEvent('pointerenter')
            button.dispatchEvent(event)
        }
        if (innerButton) {
            const event = new PointerEvent('pointerenter')
            innerButton.dispatchEvent(event)
        }
    }, TEST_INTERVAL)

    return (
        <>
            <h3>Event - Enter - Stop Immediate Propagation</h3>
            <p><button ref={ref} onPointerEnter={incrementOuter}>{outer}<button ref={refInner} onPointerEnter={incrementInner}>{inner}</button></button></p>
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