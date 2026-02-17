import { $, $$, Dynamic, store, useEffect, isStore } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

let testit = true
const TestDynamicStoreProps = (): JSX.Element => {
    let count = 1
    const props = store({ class: 'red' })
    isStore(props)
    registerTestObservable('TestDynamicStoreProps', props)

    const toggle = () => {
        const newClass = props.class === 'red' ? 'blue' : 'red'
        props.class = newClass
        testit = false
    }
    useInterval(toggle, TEST_INTERVAL)

    // Register the class tracker for test access
    return (
        <>
            <h3>Dynamic - Store Props</h3>
            <Dynamic component="div" props={props}>
                <p>{() => count++}</p>
            </Dynamic>
        </>
    )
}

TestDynamicStoreProps.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        if (testit) {
            const props: any = testObservables['TestDynamicStoreProps']
            const className = props.class
            return `<div class="${className}"><p>1</p></div>`
        }
        else {
            testit = true
            return `<div class="red"><p>1</p></div>`
        }
    }
}


export default () => <TestSnapshots Component={TestDynamicStoreProps} />