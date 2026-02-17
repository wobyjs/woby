import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestClassFunctionString = (): JSX.Element => {
    const o = $('red')
    registerTestObservable('TestClassFunctionString', o)
    const toggle = () => o(prev => (prev === 'red') ? 'blue' : 'red')
    useInterval(toggle, TEST_INTERVAL)
    return (
        <>
            <h3>Class - Function String</h3>
            <p class={() => o()}>content</p>
        </>
    )
}

TestClassFunctionString.test = {
    static: false,
    expect: () => {
        const value = $$(testObservables['TestClassFunctionString'])
        return `<p class="${value}">content</p>`
    }
}


export default () => <TestSnapshots Component={TestClassFunctionString} />