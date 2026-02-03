import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestBooleanRemoval = (): JSX.Element => {
    const o = $<boolean | null>(true)
    // Store the observable globally so the test can access it
    registerTestObservable('TestBooleanRemoval', o)
    const toggle = () => o(prev => prev ? null : true)
    useInterval(toggle, TEST_INTERVAL)
    return (
        <>
            <h3>Boolean - Removal</h3>
            <p>({o})</p>
        </>
    )
}

TestBooleanRemoval.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const value = $$(testObservables['TestBooleanRemoval'])
        return value !== null ? `<p>(${value ? '!----!' : ''})</p>` : '<p>()</p>'
    }
}


export default () => <TestSnapshots Component={TestBooleanRemoval} />