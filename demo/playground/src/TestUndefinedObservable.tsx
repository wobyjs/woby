import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestUndefinedObservable = (): JSX.Element => {
    const o = $<string>(undefined)
    // Store the observable globally so the test can access it
    registerTestObservable('TestUndefinedObservable', o)
    const toggle = () => o(prev => (prev === undefined) ? '' : undefined)
    useInterval(toggle, TEST_INTERVAL)
    return (
        <>
            <h3>Undefined - Observable</h3>
            <p>{o}</p>
        </>
    )
}

TestUndefinedObservable.test = {
    static: false,
    expect: () => {
        const value = $$(testObservables['TestUndefinedObservable'])
        return value !== undefined ? `<p>${value}</p>` : '<p><!----></p>'
    }
}


export default () => <TestSnapshots Component={TestUndefinedObservable} />