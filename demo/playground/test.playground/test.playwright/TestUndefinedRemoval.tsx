import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestUndefinedRemoval = (): JSX.Element => {
    const o = $<string>(undefined)
    // Store the observable globally so the test can access it
    registerTestObservable('TestUndefinedRemoval', o)
    const toggle = () => o(prev => (prev === undefined) ? '' : undefined)
    useInterval(toggle, TEST_INTERVAL)
    return (
        <>
            <h3>Undefined - Removal</h3>
            <p>({o})</p>
        </>
    )
}

TestUndefinedRemoval.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const value = $$(testObservables['TestUndefinedRemoval'])
        return value !== undefined ? `<p>(${value})</p>` : '<p>(<!---->)</p>'
    }
}


export default () => <TestSnapshots Component={TestUndefinedRemoval} />