import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestClassesArrayCleanup = (): JSX.Element => {
    const o = $<string[]>(['red'])
    const toggle = () => o(prev => prev[0] === 'red' ? ['blue'] : ['red'])
    useInterval(toggle, TEST_INTERVAL)
    return (
        <>
            <h3>Classes - Array Cleanup</h3>
            <p class={o}>content</p>
        </>
    )
}

TestClassesArrayCleanup.test = {
    static: false,
    expect: () => '<p class="red">content</p>'
}


export default () => <TestSnapshots Component={TestClassesArrayCleanup} />