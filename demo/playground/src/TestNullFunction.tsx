import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestNullFunction = (): JSX.Element => {
    const o = $<string | null>(null)
    const toggle = () => o(prev => (prev === null) ? '' : null)
    useInterval(toggle, TEST_INTERVAL)
    return (
        <>
            <h3>Null - Function</h3>
            <p>{() => o()}</p>
        </>
    )
}

TestNullFunction.test = {
    static: false,
    expect: () => '<p></p>'
}


export default () => <TestSnapshots Component={TestNullFunction} />