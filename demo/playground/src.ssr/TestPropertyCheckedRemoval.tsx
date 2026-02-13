import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestPropertyCheckedRemoval = (): JSX.Element => {
    const o = $<boolean | null>(true)
    const toggle = () => o(prev => prev ? null : true)
    useInterval(toggle, TEST_INTERVAL)
    return (
        <>
            <h3>Property - Checked Removal</h3>
            <p><input type="checkbox" checked={o} /></p>
        </>
    )
}

TestPropertyCheckedRemoval.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const value = $$(testObservables['TestPropertyCheckedRemoval'])
        return value !== null ? `<p><input type="checkbox" checked=""></p>` : '<p><input type="checkbox"></p>'
    }
}


export default () => <TestSnapshots Component={TestPropertyCheckedRemoval} />