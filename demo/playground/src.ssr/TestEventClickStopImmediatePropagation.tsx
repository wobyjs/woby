import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestEventClickStopImmediatePropagation = (): JSX.Element => {
    const outer = $(0)
    const inner = $(0)
    const incrementOuter = () => outer(prev => prev + 1)
    const incrementInner = event => {
        event.stopImmediatePropagation()
        inner(prev => prev + 1)
    }
    return (
        <>
            <h3>Event - Click - Stop Immediate Propagation</h3>
            <p><button onClick={incrementOuter}>{outer}<button onClick={incrementInner}>{inner}</button></button></p>
        </>
    )
}


export default () => <TestSnapshots Component={TestEventClickStopImmediatePropagation} />