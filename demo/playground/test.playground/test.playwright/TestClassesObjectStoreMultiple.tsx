import { $, $$, store } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

let testit = true
const TestClassesObjectStoreMultiple = (): JSX.Element => {
    const o = store({ 'red bold': true, blue: false })
    registerTestObservable('TestClassesObjectStoreMultiple', o)
    const toggle = () => {
        if (o['red bold']) {
            o['red bold'] = false
            o.blue = true
        } else {
            o['red bold'] = true
            o.blue = false
        }
        testit = false
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
    compareActualValues: true,
    expect: () => {
        if (testit) {
            const value = $$(testObservables['TestClassesObjectStoreMultiple'])
            let className = ''
            if (value['red bold']) className += 'red bold '
            if (value.blue) className += 'blue '
            return `<p class="${className.trim()}">content</p>`
        }
        else {
            testit = true
            return `<p class="">content</p>`
        }
    }
}


export default () => <TestSnapshots Component={TestClassesObjectStoreMultiple} />