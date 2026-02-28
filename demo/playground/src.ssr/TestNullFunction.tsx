import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestNullFunction = (): JSX.Element => {
    const o = $<string | null>(null)
    // Store the observable globally so the test can access it
    registerTestObservable('TestNullFunction', o)
    const toggle = () => o(prev => (prev === null) ? '' : null)
    useInterval(toggle, TEST_INTERVAL)
    return (
        <>
            <h3>Null - Function</h3>
            <p>{() => o()}</p>
        </>
    )
}

TestNullFunction.test = {
    static: false,
    expect: () => {
        const value = $$(testObservables['TestNullFunction'])
        return value !== null ? `<p>${value}</p>` : '<p><!----></p>'
    }
}


export default () => <TestSnapshots Component={TestNullFunction} />