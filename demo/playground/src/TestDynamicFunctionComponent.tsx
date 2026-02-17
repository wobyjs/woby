import { $, $$, Dynamic } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

let testit = true
const TestDynamicFunctionComponent = (): JSX.Element => {
    const level = $(1)
    registerTestObservable('TestDynamicFunctionComponent', level)
    const component = () => `h${level()}`
    const increment = () => {
        level((level() + 1) % 7 || 1)
        testit = false
    }
    useInterval(increment, TEST_INTERVAL)
    return (
        <>
            <h3>Dynamic - Function Component</h3>
            <Dynamic component={component}>
                Level: {level}
            </Dynamic>
        </>
    )
}

TestDynamicFunctionComponent.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        if (testit) {
            const level = $$(testObservables['TestDynamicFunctionComponent'])
            return `h${level}`  // Return just the tag name to match actual output
        }
        else {
            testit = true
            return 'h1'  // Return initial value
        }
    }
}


export default () => <TestSnapshots Component={TestDynamicFunctionComponent} />