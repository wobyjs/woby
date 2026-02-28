import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestTernaryObservable = (): JSX.Element => {
    const o = $(true)
    const toggle = () => o(prev => !prev)
    useInterval(toggle, TEST_INTERVAL)
    return (
        <>
            <h3>Ternary - Observable</h3>
            <Ternary when={o}>
                <p>true</p>
                <p>false</p>
            </Ternary>
        </>
    )
}

TestTernaryObservable.test = {
    static: false,
    expect: () => '<p>true</p>'
}


export default () => <TestSnapshots Component={TestTernaryObservable} />