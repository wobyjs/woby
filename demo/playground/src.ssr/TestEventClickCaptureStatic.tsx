import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestEventClickCaptureStatic = (): JSX.Element => {
    const o = $(0)
    const increment = () => o(prev => prev + 1)
    return (
        <>
            <h3>Event - Click Capture Static</h3>
            <p><button onClickCapture={increment}>{o}</button></p>
        </>
    )
}


export default () => <TestSnapshots Component={TestEventClickCaptureStatic} />