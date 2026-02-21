import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestEventMiddleClickCaptureStatic = (): JSX.Element => {
    const o = $(0)
    const ref = $<HTMLButtonElement>()
    registerTestObservable('TestEventMiddleClickCaptureStatic_o', o)
    // Remove the increment function for static test
    // const increment = () => o(prev => prev + 1)

    // Remove programmatic event firing for static test
    // useInterval(() => {
    //     const button = ref()
    //     if (button) {
    //         const event = new MouseEvent('auxclick', { button: 1 })
    //         button.dispatchEvent(event)
    //     }
    // }, TEST_INTERVAL)

    return (
        <>
            <h3>Event - Middle Click Capture Static</h3>
            <p><button ref={ref}>{o}</button></p>
        </>
    )
}


TestEventMiddleClickCaptureStatic.test = {
    static: true,
    expect: () => '<p><button>0</button></p>'
}

export default () => <TestSnapshots Component={TestEventMiddleClickCaptureStatic} />