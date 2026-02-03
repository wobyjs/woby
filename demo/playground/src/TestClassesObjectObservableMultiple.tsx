import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestClassesObjectObservableMultiple = (): JSX.Element => {
    const o = $({ 'red bold': true, blue: false })
    const toggle = () => o(prev => prev['red bold'] ? { 'red bold': false, blue: true } : { 'red bold': true, blue: false })
    useInterval(toggle, TEST_INTERVAL)
    return (
        <>
            <h3>Classes - Object Observable Multiple</h3>
            <p class={o}>content</p>
        </>
    )
}

TestClassesObjectObservableMultiple.test = {
    static: false,
    expect: () => '<p class="red bold">content</p>'
}


export default () => <TestSnapshots Component={TestClassesObjectObservableMultiple} />