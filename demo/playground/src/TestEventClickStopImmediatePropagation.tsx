import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

let testit = true
const TestEventClickStopImmediatePropagation = (): JSX.Element => {
    const outer = $(0)
    const inner = $(0)
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

    return (
        <>
            <h3>Event - Click - Stop Immediate Propagation</h3>
            <p><button onClick={onClickOuter}>{outer}<button onClick={onClickInner}>{inner}</button></button></p>
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