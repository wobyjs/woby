import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestPropertyCheckedObservable = (): JSX.Element => {
    const o = $(true)
    const toggle = () => o(prev => !prev)
    useInterval(toggle, TEST_INTERVAL)
    return (
        <>
            <h3>Property - Checked Observable</h3>
            <p><input type="checkbox" checked={o} /></p>
        </>
    )
}


export default () => <TestSnapshots Component={TestPropertyCheckedObservable} />