import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestPropertyValueStatic = (): JSX.Element => {
    return (
        <>
            <h3>Property - Value Static</h3>
            <p><input value="value" /></p>
        </>
    )
}


export default () => <TestSnapshots Component={TestPropertyValueStatic} />