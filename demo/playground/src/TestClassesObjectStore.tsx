import { $, $$, store } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

let testit = true
const TestClassesObjectStore = (): JSX.Element => {
    const o = store({ red: true, blue: false })
    registerTestObservable('TestClassesObjectStore', o)
    const toggle = () => {
        if (o.red) {
            o.red = false
            o.blue = true
        } else {
            o.red = true
            o.blue = false
        }
        testit = false
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
    compareActualValues: true,
    expect: () => {
        if (testit) {
            const value = $$(testObservables['TestClassesObjectStore'])
            let className = ''
            if (value.red) className += 'red '
            if (value.blue) className += 'blue '
            return `<p class="${className.trim()}">content</p>`
        }
        else {
            testit = true
            return `<p class="">content</p>`
        }
    }
}


export default () => <TestSnapshots Component={TestClassesObjectStore} />