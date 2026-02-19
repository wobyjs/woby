import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestBooleanFunction = (): JSX.Element => {
    const o = $(true)
    const toggle = () => o(prev => !prev)
    useInterval(toggle, TEST_INTERVAL)
    return (
        <>
            <h3>Boolean - Function</h3>
            <p>{() => o()}</p>
        </>
    )
}

TestBooleanFunction.test = {
    static: true,
    expect: () => '<p><!----></p>'
}


export default () => <TestSnapshots Component={TestBooleanFunction} />