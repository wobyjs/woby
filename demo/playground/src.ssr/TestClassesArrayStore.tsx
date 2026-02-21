import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestClassesArrayStore = (): JSX.Element => {
    const o = store(['red', false])
    const toggle = () => {
        if (o[0]) {
            o[0] = false
            o[1] = 'blue'
        } else {
            o[0] = 'red'
            o[1] = false
        }
    }
    useInterval(toggle, TEST_INTERVAL)
    return (
        <>
            <h3>Classes - Array Store</h3>
            <p class={o}>content</p>
        </>
    )
}

TestClassesArrayStore.test = {
    static: false,
    expect: () => '<p class="red">content</p>'
}


export default () => <TestSnapshots Component={TestClassesArrayStore} />