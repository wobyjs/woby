import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestClassesObjectCleanup = (): JSX.Element => {
    const o = $<JSX.ClassProperties>({ red: true })
    registerTestObservable('TestClassesObjectCleanup', o)
    const toggle = () => o(prev => prev.red ? { blue: true } : { red: true })
    useInterval(toggle, TEST_INTERVAL)
    return (
        <>
            <h3>Classes - Object Cleanup</h3>
            <p class={o}>content</p>
        </>
    )
}

TestClassesObjectCleanup.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const value = $$(testObservables['TestClassesObjectCleanup'])
        const classes = typeof value === 'object' ? Object.keys(value).filter(k => value[k]).join(' ') : (value || '')
        return `<p class="${classes}">content</p>`
    }
}


export default () => <TestSnapshots Component={TestClassesObjectCleanup} />