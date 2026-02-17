import { $, $$, Dynamic } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

let testit = true
const TestDynamicObservableProps = (): JSX.Element => {
    const red = { class: 'red' }
    const blue = { class: 'blue' }
    const props = $(red)
    registerTestObservable('TestDynamicObservableProps', props)
    const toggle = () => {
        props(prev => prev === red ? blue : red)
        testit = false
    }
    useInterval(toggle, TEST_INTERVAL)
    return (
        <>
            <h3>Dynamic - Observable Props</h3>
            <Dynamic component="h5" props={props}>
                Content
            </Dynamic>
        </>
    )
}

TestDynamicObservableProps.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const props = $$(testObservables['TestDynamicObservableProps'])
        return `<h5 class="${props.class}">Content</h5>`
    }
}


export default () => <TestSnapshots Component={TestDynamicObservableProps} />