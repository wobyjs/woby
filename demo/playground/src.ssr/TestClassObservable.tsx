import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestClassObservable = (): JSX.Element => {
    const o = $(true)
    // Store the observable globally so the test can access it
    registerTestObservable('TestClassObservable', o)
    const toggle = () => o(prev => !prev)
    useInterval(toggle, TEST_INTERVAL)
    return (
        <>
            <h3>Class - Observable</h3>
            <p class={{ red: o }}>content</p>
        </>
    )
}

TestClassObservable.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const value = $$(testObservables['TestClassObservable'])
        const className = value ? 'red' : ''
        return `<p class="${className}">content</p>`
    }
}


export default () => <TestSnapshots Component={TestClassObservable} />