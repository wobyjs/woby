import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestEventClickObservable = (): JSX.Element => {
    const o = $(0)
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
    return (
        <>
            <h3>Event - Click Observable</h3>
            <p><button onClick={onClick}>{o}</button></p>
        </>
    )
}


export default () => <TestSnapshots Component={TestEventClickObservable} />