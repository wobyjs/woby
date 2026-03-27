import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestClassesArrayObservableMultiple = (): JSX.Element => {
    const o = $(['red bold', false])
    registerTestObservable('TestClassesArrayObservableMultiple', o)
    const toggle = () => o(prev => prev[0] ? [false, 'blue'] : ['red bold', false])
    useInterval(toggle, TEST_INTERVAL)
    return (
        <>
            <h3>Classes - Array Observable Multiple</h3>
            <p class={o}>content</p>
        </>
    )
}

TestClassesArrayObservableMultiple.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const value = $$(testObservables['TestClassesArrayObservableMultiple'])
        const classes = Array.isArray(value) ? value.filter(v => v && v !== false).join(' ') : (value || '')
        return `<p class="${classes}">content</p>`
    }
}


export default () => <TestSnapshots Component={TestClassesArrayObservableMultiple} />