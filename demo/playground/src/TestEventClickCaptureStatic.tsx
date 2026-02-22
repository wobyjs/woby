import { $, $$ } from 'woby'
import { TestSnapshots } from './util'

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


TestEventClickCaptureStatic.test = {
    static: true,
    expect: () => {
        const value = testObservables['TestEventClickCaptureStatic_o']?.() ?? 0
        return `<p><button>${value}</button></p>`
    }
}

export default () => <TestSnapshots Component={TestEventClickCaptureStatic} />