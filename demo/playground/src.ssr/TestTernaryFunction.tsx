import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestTernaryFunction = (): JSX.Element => {
    const o = $(true)
    const toggle = () => o(prev => !prev)
    useInterval(toggle, TEST_INTERVAL)
    return (
        <>
            <h3>Ternary - Function</h3>
            <Ternary when={() => !o()}>
                <p>true</p>
                <p>false</p>
            </Ternary>
        </>
    )
}

TestTernaryFunction.test = {
    static: false,
    expect: () => '<p>false</p>'
}


export default () => <TestSnapshots Component={TestTernaryFunction} />