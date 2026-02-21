import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestNullRemoval = (): JSX.Element => {
    const o = $<string | null>(null)
    // Store the observable globally so the test can access it
    registerTestObservable('TestNullRemoval', o)
    const toggle = () => o(prev => (prev === null) ? '' : null)
    useInterval(toggle, TEST_INTERVAL)
    return (
        <>
            <h3>Null - Removal</h3>
            <p>({o})</p>
        </>
    )
}

TestNullRemoval.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const value = $$(testObservables['TestNullRemoval'])
        return value !== null ? `<p>(${value})</p>` : '<p>(<!---->)</p>'
    }
}


export default () => <TestSnapshots Component={TestNullRemoval} />