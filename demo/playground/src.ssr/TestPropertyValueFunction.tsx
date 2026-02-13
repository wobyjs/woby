import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestPropertyValueFunction = (): JSX.Element => {
    const o = $(String(random()))
    const randomize = () => o(String(random()))
    useInterval(randomize, TEST_INTERVAL)
    return (
        <>
            <h3>Property - Value Function</h3>
            <p><input value={() => o()} /></p>
        </>
    )
}


export default () => <TestSnapshots Component={TestPropertyValueFunction} />