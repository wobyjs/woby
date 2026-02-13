import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestInputLabelFor = (): JSX.Element => {
    const o = $<string | null>(String(random()))
    const randomize = () => o(prev => prev ? null : String(random()))
    useInterval(randomize, TEST_INTERVAL)
    return (
        <>
            <h3>Input - Label For</h3>
            <p><label htmlFor="for-target">htmlFor</label></p>
            <p><label for="for-target">for</label></p>
            <p><input id="for-target" /></p>
        </>
    )
}


export default () => <TestSnapshots Component={TestInputLabelFor} />