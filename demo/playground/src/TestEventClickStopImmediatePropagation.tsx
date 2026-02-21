import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

let testit = true
const TestEventClickStopImmediatePropagation = (): JSX.Element => {
    const outer = $(0)
    const inner = $(0)
    const ref = $<HTMLButtonElement>()
    const refInner = $<HTMLButtonElement>()
    registerTestObservable('TestEventClickStopImmediatePropagation_outer', outer)
    registerTestObservable('TestEventClickStopImmediatePropagation_inner', inner)
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
            button.click()
        }
        if (innerButton) {
            innerButton.click()
        }
    }, TEST_INTERVAL)

    return (
        <>
            <h3>Event - Click - Stop Immediate Propagation</h3>
            <p><button ref={ref} onClick={incrementOuter}>{outer}<button ref={refInner} onClick={incrementInner}>{inner}</button></button></p>
        </>
    )
}


TestEventClickStopImmediatePropagation.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        if (testit) {
            return `<p><button>0<button>0</button></button></p>`
        }
        else {
            const outerValue = $$(testObservables['TestEventClickStopImmediatePropagation_outer'])
            const innerValue = $$(testObservables['TestEventClickStopImmediatePropagation_inner'])
            testit = true
            return `<p><button>${outerValue}<button>${innerValue}</button></button></p>`
        }
    }
}

export default () => <TestSnapshots Component={TestEventClickStopImmediatePropagation} />