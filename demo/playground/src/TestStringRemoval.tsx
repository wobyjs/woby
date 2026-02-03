import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestStringRemoval = (): JSX.Element => {
    const o = $<string | null>(String(random()))
    registerTestObservable('TestStringRemoval', o)
    const randomize = () => o(prev => prev ? null : String(random()))
    useInterval(randomize, TEST_INTERVAL)
    return (
        <>
            <h3>String - Removal</h3>
            <p>({o})</p>
        </>
    )
}

TestStringRemoval.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const val = $$(testObservables['TestStringRemoval'])
        return val !== null ? `<p>(${val})</p>` : '<p>(<!---->)</p>'
    }
}


export default () => <TestSnapshots Component={TestStringRemoval} />