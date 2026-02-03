import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestPropertyCheckedFunction = (): JSX.Element => {
    const o = $(true)
    const toggle = () => o(prev => !prev)
    useInterval(toggle, TEST_INTERVAL)
    return (
        <>
            <h3>Property - Checked Function</h3>
            <p><input type="checkbox" checked={() => o()} /></p>
        </>
    )
}


export default () => <TestSnapshots Component={TestPropertyCheckedFunction} />