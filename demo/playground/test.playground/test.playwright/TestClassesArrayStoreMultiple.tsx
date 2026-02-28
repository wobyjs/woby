import { $, $$, store } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

let testit = true
const TestClassesArrayStoreMultiple = (): JSX.Element => {
    const o = $(['red bold', false])
    registerTestObservable('TestClassesArrayStoreMultiple', o)
    const toggle = () => {
        if (o[0]) {
            o[0] = false
            o[1] = 'blue'
        } else {
            o[0] = 'red bold'
            o[1] = false
        }
        testit = false
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
    compareActualValues: true,
    expect: () => {
        if (testit) {
            const value = $$(testObservables['TestClassesArrayStoreMultiple'])
            const classes = []
            if (value[0]) classes.push(value[0])
            if (value[1]) classes.push(value[1])
            return `<p class="${classes.join(' ')}">content</p>`
        }
        else {
            testit = true
            return `<p class="">content</p>`
        }
    }
}


export default () => <TestSnapshots Component={TestClassesArrayStoreMultiple} />