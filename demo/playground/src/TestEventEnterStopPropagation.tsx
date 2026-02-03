import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestEventEnterStopPropagation = (): JSX.Element => {
    const outer = $(0)
    const inner = $(0)
    const incrementOuter = () => outer(prev => prev + 1)
    const incrementInner = event => {
        event.stopPropagation()
        inner(prev => prev + 1)
    }
    return (
        <>
            <h3>Event - Enter - Stop Propagation</h3>
            <p><button onPointerEnter={incrementOuter}>{outer}<button onPointerEnter={incrementInner}>{inner}</button></button></p>
        </>
    )
}


export default () => <TestSnapshots Component={TestEventEnterStopPropagation} />