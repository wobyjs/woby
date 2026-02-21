import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestIfFunctionUntracked = (): JSX.Element => {
    const o = $(true)
    const toggle = () => o(prev => !prev)
    useInterval(toggle, TEST_INTERVAL)
    return (
        <If when={true}>
            Noop
            <If when={o} fallback="fallback">
                {() => (
                    <button onClick={() => o(false)}>
                        Close {o()}
                    </button>
                )}
            </If>
        </If>
    )
}

TestIfFunctionUntracked.test = {
    static: false,
    expect: () => 'Noop<button>Close </button>'
}


export default () => <TestSnapshots Component={TestIfFunctionUntracked} />