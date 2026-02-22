import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestEventClickRemoval = (): JSX.Element => {
    const o = $(0)
    const onClick = $(() => { })
    const increment = () => o(prev => {
        onClick(() => null)
        return prev + 1
    })
    onClick(() => increment)

    return (
        <>
            <h3>Event - Click Removal</h3>
            <p><button onClick={onClick}>{o}</button></p>
        </>
    )
}


TestEventClickRemoval.test = {
    static: false,
    expect: () => {
        const value = testObservables['TestEventClickRemoval_o']?.() ?? 0
        return `<p><button>${value}</button></p>`
    }
}

export default () => <TestSnapshots Component={TestEventClickRemoval} />