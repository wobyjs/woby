import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestEventEnterAndEnterCaptureStatic = (): JSX.Element => {
    const o = $(0)
    const ref = $<HTMLButtonElement>()
    registerTestObservable('TestEventEnterAndEnterCaptureStatic_o', o)
    const increment = () => o(prev => prev + 1)

    // Programmatic event firing
    useInterval(() => {
        const button = ref()
        if (button) {
            const event = new PointerEvent('pointerenter')
            button.dispatchEvent(event)
        }
    }, TEST_INTERVAL)

    return (
        <>
            <h3>Event - Enter & Enter Capture Static</h3>
            <p><button ref={ref} onPointerEnter={increment} onPointerEnterCapture={increment}>{o}</button></p>
        </>
    )
}


TestEventEnterAndEnterCaptureStatic.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const value = $$(testObservables['TestEventEnterAndEnterCaptureStatic_o'])
        return `<p><button>${value}</button></p>`
    }
}

export default () => <TestSnapshots Component={TestEventEnterAndEnterCaptureStatic} />