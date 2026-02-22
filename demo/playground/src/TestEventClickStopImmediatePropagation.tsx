import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

let testit = true
const TestEventClickStopImmediatePropagation = (): JSX.Element => {
    const outer = $(0)
    const inner = $(0)
    const refOuter = $<HTMLButtonElement>()
    const refInner = $<HTMLButtonElement>()
    registerTestObservable('TestEventClickStopImmediatePropagation_outer', outer)
    registerTestObservable('TestEventClickStopImmediatePropagation_inner', inner)
    const onClickOuter = $(() => { })
    const onClickInner = $(() => { })
    
    const incrementOuter = () => {
        outer(prev => prev + 1)
        testit = false
    }
    
    const incrementInner = event => {
        event.stopImmediatePropagation()
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
            buttonOuter.click()
        }
        if (buttonInner) {
            buttonInner.click()
        }
    }, TEST_INTERVAL)

    return (
        <>
            <h3>Event - Click - Stop Immediate Propagation</h3>
            <p><button ref={refOuter} onClick={onClickOuter}>{outer}<button ref={refInner} onClick={onClickInner}>{inner}</button></button></p>
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