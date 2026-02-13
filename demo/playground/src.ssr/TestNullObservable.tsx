import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestNullObservable = (): JSX.Element => {
    const o = $<string | null>(null)
    // Store the observable globally so the test can access it
    registerTestObservable('TestNullObservable', o)
    const toggle = () => o(prev => (prev === null) ? '' : null)
    useInterval(toggle, TEST_INTERVAL)
    return (
        <>
            <h3>Null - Observable</h3>
            <p>{o}</p>
        </>
    )
}

TestNullObservable.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        // When null is rendered, it becomes <!----> comment
        const value = $$(testObservables['TestNullObservable'])
        return value !== null ? `<p>${value}</p>` : '<p><!----></p>'
    }
}


export default () => <TestSnapshots Component={TestNullObservable} />