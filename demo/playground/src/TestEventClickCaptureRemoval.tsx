import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestEventClickCaptureRemoval = (): JSX.Element => {
    const o = $(0)
    const onClick = $(() => { })
    const increment = () => o(prev => {
        onClick(() => null)
        return prev + 1
    })
    onClick(() => increment)
    return (
        <>
            <h3>Event - Click Capture Removal</h3>
            <p><button onClickCapture={onClick}>{o}</button></p>
        </>
    )
}


export default () => <TestSnapshots Component={TestEventClickCaptureRemoval} />