import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestEventMiddleClickCaptureStatic = (): JSX.Element => {
    const o = $(0)
    const increment = () => o(prev => prev + 1)
    return (
        <>
            <h3>Event - Middle Click Capture Static</h3>
            <p><button onMiddleClickCapture={increment}>{o}</button></p>
        </>
    )
}


export default () => <TestSnapshots Component={TestEventMiddleClickCaptureStatic} />