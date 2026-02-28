import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestPropertyCheckedStatic = (): JSX.Element => {
    return (
        <>
            <h3>Property - Checked Static</h3>
            <p><input type="checkbox" checked={true} /></p>
        </>
    )
}


export default () => <TestSnapshots Component={TestPropertyCheckedStatic} />