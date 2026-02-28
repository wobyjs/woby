import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestClassesObjectFunction = (): JSX.Element => {
    const o = $({ red: true, blue: false })
    const toggle = () => o(prev => prev.red ? { red: false, blue: true } : { red: true, blue: false })
    useInterval(toggle, TEST_INTERVAL)
    return (
        <>
            <h3>Classes - Object Function</h3>
            <p class={() => o()}>content</p>
        </>
    )
}

TestClassesObjectFunction.test = {
    static: false,
    expect: () => '<p class="red">content</p>'
}


export default () => <TestSnapshots Component={TestClassesObjectFunction} />