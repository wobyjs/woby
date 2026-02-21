import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestIfNestedFunctionNarrowed = (): JSX.Element => {
    const o = $(true)
    const content = $(0)
    const increment = () => content(prev => (prev + 1) % 3)
    useInterval(increment, TEST_INTERVAL)
    return (
        <>
            <h3>If - Nested Function Narrowed</h3>
            <p>(<If when={o}>{value => () => content()}</If>)</p>
        </>
    )
}

TestIfNestedFunctionNarrowed.test = {
    static: false,
    expect: () => '<p>(0)</p>'
}


export default () => <TestSnapshots Component={TestIfNestedFunctionNarrowed} />