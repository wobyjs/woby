import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestClassesArrayFunctionValue = (): JSX.Element => {
    const o = $('red')
    registerTestObservable('TestClassesArrayFunctionValue', o)
    const toggle = () => o(prev => prev === 'red' ? 'blue' : 'red')
    useInterval(toggle, TEST_INTERVAL)
    return (
        <>
            <h3>Classes - Array Function Value</h3>
            <p class={[() => o()]}>content</p>
        </>
    )
}

TestClassesArrayFunctionValue.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const value = $$(testObservables['TestClassesArrayFunctionValue'])
        return `<p class="${value}">content</p>`
    }
}


export default () => <TestSnapshots Component={TestClassesArrayFunctionValue} />