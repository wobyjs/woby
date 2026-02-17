import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestEventClickCaptureObservable = (): JSX.Element => {
    const o = $(0)
    const ref = $<HTMLButtonElement>()
    registerTestObservable('TestEventClickCaptureObservable_o', o)
    const increment = () => o(prev => prev + 1)

    // Fire click event programmatically
    useInterval(() => {
        const button = ref()
        if (button) {
            button.click()
        }
    }, TEST_INTERVAL)

    return (
        <>
            <h3>Event - Click Capture Observable</h3>
            <p><button ref={ref} onClickCapture={increment}>{o}</button></p>
        </>
    )
}


TestEventClickCaptureObservable.test = {
    static: false,
    expect: () => {
        const value = testObservables['TestEventClickCaptureObservable_o']?.() ?? 0
        return `<p><button>${value}</button></p>`
    }
}

export default () => <TestSnapshots Component={TestEventClickCaptureObservable} />