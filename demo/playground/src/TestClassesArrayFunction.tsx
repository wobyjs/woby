import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestClassesArrayFunction = (): JSX.Element => {
    const o = $(['red', false])
    // Store the observable globally so the test can access it
    registerTestObservable('TestClassesArrayFunction', o)
    const toggle = () => o(prev => prev[0] ? [false, 'blue'] : ['red', false])
    useInterval(toggle, TEST_INTERVAL)
    return (
        <>
            <h3>Classes - Array Function</h3>
            <p class={() => o()}>content</p>
        </>
    )
}

TestClassesArrayFunction.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const value = $$(testObservables['TestClassesArrayFunction'])
        const classes = Array.isArray(value) ? value.filter(v => v && v !== false).join(' ') : (value || '')
        return `<p class="${classes}">content</p>`
    }
}


export default () => <TestSnapshots Component={TestClassesArrayFunction} />