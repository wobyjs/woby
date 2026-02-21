import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestClassesArrayObservableValue = (): JSX.Element => {
    const o = $('red')
    // Store the observable globally so the test can access it
    registerTestObservable('TestClassesArrayObservableValue', o)
    const toggle = () => o(prev => prev === 'red' ? 'blue' : 'red')
    useInterval(toggle, TEST_INTERVAL)
    return (
        <>
            <h3>Classes - Array Observable Value</h3>
            <p class={o}>{() => $$(o)}</p>
        </>
    )
}

TestClassesArrayObservableValue.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const value = $$(testObservables['TestClassesArrayObservableValue'])
        return `<p class="${value}">${value}</p>`
    }
}


export default () => <TestSnapshots Component={TestClassesArrayObservableValue} />