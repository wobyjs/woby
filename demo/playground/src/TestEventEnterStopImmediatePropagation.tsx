import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

let testit = true
const TestEventEnterStopImmediatePropagation = (): JSX.Element => {
    const outer = $(0)
    const inner = $(0)
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

    return (
        <>
            <h3>Event - Enter - Stop Immediate Propagation</h3>
            <p><button onPointerEnter={onEnterOuter}>{outer}<button onPointerEnter={onEnterInner}>{inner}</button></button></p>
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