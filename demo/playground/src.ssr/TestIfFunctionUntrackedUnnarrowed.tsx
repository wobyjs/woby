import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestIfFunctionUntrackedUnnarrowed = (): JSX.Element => {
    const o = $(true)
    const content = $(0)
    const increment = () => content(prev => (prev + 1) % 3)
    useInterval(increment, TEST_INTERVAL)
    return (
        <>
            <h3>If - Function Untracked Unnarrowed</h3>
            <p>(<If when={o}>{() => content()}</If>)</p>
        </>
    )
}

TestIfFunctionUntrackedUnnarrowed.test = {
    static: true,
    expect: () => '<p>(0)</p>'
}


export default () => <TestSnapshots Component={TestIfFunctionUntrackedUnnarrowed} />