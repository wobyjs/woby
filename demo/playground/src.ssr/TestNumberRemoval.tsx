import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, random } from './util'

const TestNumberRemoval = (): JSX.Element => {
    const o = $<number | null>(random())
    registerTestObservable('TestNumberRemoval', o)
    const randomize = () => o(prev => prev ? null : random())
    useInterval(randomize, TEST_INTERVAL)
    return (
        <>
            <h3>Number - Removal</h3>
            <p>({o})</p>
        </>
    )
}

TestNumberRemoval.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const val = $$(testObservables['TestNumberRemoval'])
        return val !== null ? `<p>(${val})</p>` : '<p>(<!---->)</p>'
    }
}


export default () => <TestSnapshots Component={TestNumberRemoval} />