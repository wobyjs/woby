import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestClassesArrayStoreMultiple = (): JSX.Element => {
    const o = store(['red bold', false])
    const toggle = () => {
        if (o[0]) {
            o[0] = false
            o[1] = 'blue'
        } else {
            o[0] = 'red bold'
            o[1] = false
        }
    }
    useInterval(toggle, TEST_INTERVAL)
    return (
        <>
            <h3>Classes - Array Store Multiple</h3>
            <p class={o}>content</p>
        </>
    )
}

TestClassesArrayStoreMultiple.test = {
    static: false,
    expect: () => '<p class="red bold">content</p>'
}


export default () => <TestSnapshots Component={TestClassesArrayStoreMultiple} />