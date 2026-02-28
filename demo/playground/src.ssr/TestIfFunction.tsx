import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestIfFunction = (): JSX.Element => {
    const o = $(true)
    const toggle = () => o(prev => !prev)
    useInterval(toggle, TEST_INTERVAL)
    return (
        <>
            <h3>If - Function</h3>
            <p>(<If when={() => o()}>content</If>)</p>
        </>
    )
}

TestIfFunction.test = {
    static: false,
    expect: () => '<p>(content)</p>'
}


export default () => <TestSnapshots Component={TestIfFunction} />