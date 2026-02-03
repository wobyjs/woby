import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestClassesObjectStore = (): JSX.Element => {
    const o = store({ red: true, blue: false })
    const toggle = () => {
        if (o.red) {
            o.red = false
            o.blue = true
        } else {
            o.red = true
            o.blue = false
        }
    }
    useInterval(toggle, TEST_INTERVAL)
    return (
        <>
            <h3>Classes - Object Store</h3>
            <p class={o}>content</p>
        </>
    )
}

TestClassesObjectStore.test = {
    static: false,
    expect: () => '<p class="red">content</p>'
}


export default () => <TestSnapshots Component={TestClassesObjectStore} />