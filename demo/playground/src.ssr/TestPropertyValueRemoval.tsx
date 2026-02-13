import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestPropertyValueRemoval = (): JSX.Element => {
    const o = $<string | null>(String(random()))
    const randomize = () => o(prev => prev ? null : String(random()))
    useInterval(randomize, TEST_INTERVAL)
    return (
        <>
            <h3>Property - Value Removal</h3>
            <p><input value={o} /></p>
        </>
    )
}

TestPropertyValueRemoval.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const value = $$(testObservables['TestPropertyValueRemoval'])
        return value !== null ? `<p><input value="${value}"></p>` : '<p><input></p>'
    }
}


export default () => <TestSnapshots Component={TestPropertyValueRemoval} />