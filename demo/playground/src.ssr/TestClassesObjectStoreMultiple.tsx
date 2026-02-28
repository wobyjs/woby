import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestClassesObjectStoreMultiple = (): JSX.Element => {
    const o = store({ 'red bold': true, blue: false })
    const toggle = () => {
        if (o['red bold']) {
            o['red bold'] = false
            o.blue = true
        } else {
            o['red bold'] = true
            o.blue = false
        }
    }
    useInterval(toggle, TEST_INTERVAL)
    return (
        <>
            <h3>Classes - Object Store Multiple</h3>
            <p class={o}>content</p>
        </>
    )
}

TestClassesObjectStoreMultiple.test = {
    static: false,
    expect: () => '<p class="red bold">content</p>'
}


export default () => <TestSnapshots Component={TestClassesObjectStoreMultiple} />