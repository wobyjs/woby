import { $, $$ } from 'woby'
import { TestSnapshots } from './util'

const TestEventEnterAndEnterCaptureStatic = (): JSX.Element => {
    const o = $(0)
    const increment = () => o(prev => prev + 1)

    return (
        <>
            <h3>Event - Enter & Enter Capture Static</h3>
            <p><button onPointerEnter={increment} onPointerEnterCapture={increment}>{o}</button></p>
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