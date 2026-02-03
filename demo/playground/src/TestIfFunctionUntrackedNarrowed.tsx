import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestIfFunctionUntrackedNarrowed = (): JSX.Element => {
    const o = $(true)
    const content = $(0)
    const increment = () => content(prev => (prev + 1) % 3)
    useInterval(increment, TEST_INTERVAL)
    return (
        <>
            <h3>If - Function Untracked Narrowed</h3>
            <p>(<If when={o}>{value => content()}</If>)</p>
        </>
    )
}

TestIfFunctionUntrackedNarrowed.test = {
    static: true,
    expect: () => '<p>(0)</p>'
}


export default () => <TestSnapshots Component={TestIfFunctionUntrackedNarrowed} />