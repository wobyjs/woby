import { $, $$ } from 'woby'
import { TestSnapshots } from './util'

const TestEventMiddleClickCaptureStatic = (): JSX.Element => {
    const o = $(0)
    const increment = () => o(prev => prev + 1)

    return (
        <>
            <h3>Event - Middle Click Capture Static</h3>
            <p><button onMiddleClickCapture={increment}>{o}</button></p>
        </>
    )
}


TestEventMiddleClickCaptureStatic.test = {
    static: true,
    expect: () => '<p><button>0</button></p>'
}

export default () => <TestSnapshots Component={TestEventMiddleClickCaptureStatic} />