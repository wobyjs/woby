import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestClassesArrayObservable = (): JSX.Element => {
    const o = $(['red', false])
    registerTestObservable('TestClassesArrayObservable', o)
    const toggle = () => o(prev => prev[0] ? [false, 'blue'] : ['red', false])
    useInterval(toggle, TEST_INTERVAL)
    return (
        <>
            <h3>Classes - Array Observable</h3>
            <p class={o}>content</p>
        </>
    )
}

TestClassesArrayObservable.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const value = $$(testObservables['TestClassesArrayObservable'])
        const classes = Array.isArray(value) ? value.filter(v => v && v !== false).join(' ') : (value || '')
        return `<p class="${classes}">content</p>`
    }
}


export default () => <TestSnapshots Component={TestClassesArrayObservable} />