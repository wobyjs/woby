import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestClassesArrayObservableMultiple = (): JSX.Element => {
    const o = $(['red bold', false])
    const toggle = () => o(prev => prev[0] ? [false, 'blue'] : ['red bold', false])
    useInterval(toggle, TEST_INTERVAL)
    return (
        <>
            <h3>Classes - Array Observable Multiple</h3>
            <p class={o}>content</p>
        </>
    )
}

TestClassesArrayObservableMultiple.test = {
    static: false,
    expect: () => '<p class="red bold">content</p>'
}


export default () => <TestSnapshots Component={TestClassesArrayObservableMultiple} />