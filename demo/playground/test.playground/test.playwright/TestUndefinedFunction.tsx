import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestUndefinedFunction = (): JSX.Element => {
    const o = $<string>(undefined)
    // Store the observable globally so the test can access it
    registerTestObservable('TestUndefinedFunction', o)
    const toggle = () => o(prev => (prev === undefined) ? '' : undefined)
    useInterval(toggle, TEST_INTERVAL)
    return (
        <>
            <h3>Undefined - Function</h3>
            <p>{() => o()}</p>
        </>
    )
}

TestUndefinedFunction.test = {
    static: false,
    expect: () => {
        const value = $$(testObservables['TestUndefinedFunction'])
        return value !== undefined ? `<p>${value}</p>` : '<p><!----></p>'
    }
}


export default () => <TestSnapshots Component={TestUndefinedFunction} />