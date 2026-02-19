import { $, $$, Dynamic } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

let testit = true
const TestDynamicFunctionProps = (): JSX.Element => {
    const red = { class: 'red' }
    const blue = { class: 'blue' }
    const props = $(red)
    registerTestObservable('TestDynamicFunctionProps', props)
    const toggle = () => {
        props(prev => prev === red ? blue : red)
        testit = false
    }
    useInterval(toggle, TEST_INTERVAL)
    return (
        <>
            <h3>Dynamic - Function Props</h3>
            <Dynamic component="h5" props={props}>
                Content
            </Dynamic>
        </>
    )
}

TestDynamicFunctionProps.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const props = $$(testObservables['TestDynamicFunctionProps'])
        return `<h5 class="${props.class}">Content</h5>`
    }
}


export default () => <TestSnapshots Component={TestDynamicFunctionProps} />