import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestEventMiddleClickStatic = (): JSX.Element => {
    const o = $(0)
    const increment = () => o(prev => prev + 1)
    return (
        <>
            <h3>Event - Middle Click Static</h3>
            <p><button onMiddleClick={increment}>{o}</button></p>
        </>
    )
}


export default () => <TestSnapshots Component={TestEventMiddleClickStatic} />