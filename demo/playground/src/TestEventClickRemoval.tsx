import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestEventClickRemoval = (): JSX.Element => {
    const o = $(0)
    const ref = $<HTMLButtonElement>()
    registerTestObservable('TestEventClickRemoval_o', o)
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
            <h3>Event - Click Removal</h3>
            <p><button ref={ref} onClick={increment}>{o}</button></p>
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