import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestEventClickAndClickCaptureStatic = (): JSX.Element => {
    const o = $(0)
    const ref = $<HTMLButtonElement>()
    registerTestObservable('TestEventClickAndClickCaptureStatic_o', o)

    const increment = () => o(prev => prev + 1)
    const captureIncrement = () => o(prev => prev + 1)

    // Fire click event programmatically
    useInterval(() => {
        const button = ref()
        if (button) {
            button.click()
        }
    }, TEST_INTERVAL)

    return (
        <>
            <h3>Event - Click & Click Capture Static</h3>
            <p><button ref={ref} onClick={increment} onClickCapture={captureIncrement}>{o}</button></p>
        </>
    )
}


TestEventClickAndClickCaptureStatic.test = {
    static: true,
    expect: () => {
        const value = testObservables['TestEventClickAndClickCaptureStatic_o']?.() ?? 0
        // Should increment by 1 per click, not 2
        return `<p><button>${value}</button></p>`
    }
}

export default () => <TestSnapshots Component={TestEventClickAndClickCaptureStatic} />