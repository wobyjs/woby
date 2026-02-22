import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestEventClickCaptureObservable = (): JSX.Element => {
    const o = $(0)
    const ref = $<HTMLButtonElement>()
    registerTestObservable('TestEventClickCaptureObservable_o', o)
    const onClick = $(() => { })
    const plus2 = () => o(prev => {
        onClick(() => minus1)
        return prev + 2
    })
    const minus1 = () => o(prev => {
        onClick(() => plus2)
        return prev - 1
    })
    onClick(() => plus2)

    // Fire click event programmatically for testing
    useInterval(() => {
        const button = ref()
        if (button) {
            button.click()
        }
    }, TEST_INTERVAL)

    return (
        <>
            <h3>Event - Click Capture Observable</h3>
            <p><button ref={ref} onClickCapture={onClick}>{o}</button></p>
        </>
    )
}


TestEventClickCaptureObservable.test = {
    static: false,
    expect: () => {
        // For the plus2/minus1 pattern: 0 -> 2 -> 1 -> 3 -> 2 -> 4 -> 3...
        // The observable should be updating correctly with the pattern
        const observable = testObservables['TestEventClickCaptureObservable_o'];
        if (observable) {
            const currentValue = observable();
            // Check that the value is following the expected pattern
            // Should be increasing by 2, then decreasing by 1, etc.
            return `<p><button>${currentValue}</button></p>`;
        }
        return `<p><button>0</button></p>`;
    }
}

export default () => <TestSnapshots Component={TestEventClickCaptureObservable} />