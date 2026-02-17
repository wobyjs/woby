import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestEventClickStatic = (): JSX.Element => {
    const o = $(0)
    const ref = $<HTMLButtonElement>()
    registerTestObservable('TestEventClickStatic_o', o)
    const increment = () => o(prev => prev + 1)

    // Programmatic click firing
    useInterval(() => {
        const button = ref()
        if (button) {
            button.click()
        }
    }, TEST_INTERVAL)

    return (
        <>
            <h3>Event - Click Static</h3>
            <p><button ref={ref} onClick={increment}>{o}</button></p>
        </>
    )
}


TestEventClickStatic.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const value = $$(testObservables['TestEventClickStatic_o'])
        return `<p><button>${value}</button></p>`
    }
}

export default () => <TestSnapshots Component={TestEventClickStatic} />