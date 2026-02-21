import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestEventClickCaptureStatic = (): JSX.Element => {
    const o = $(0)
    const ref = $<HTMLButtonElement>()
    registerTestObservable('TestEventClickCaptureStatic_o', o)
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
            <h3>Event - Click Capture Static</h3>
            <p><button ref={ref} onClickCapture={increment}>{o}</button></p>
        </>
    )
}


TestEventClickCaptureStatic.test = {
    static: true,
    expect: () => {
        const value = testObservables['TestEventClickCaptureStatic_o']?.() ?? 0
        return `<p><button>${value}</button></p>`
    }
}

export default () => <TestSnapshots Component={TestEventClickCaptureStatic} />