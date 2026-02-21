import { $, $$, Dynamic, useMemo } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

let testit = true
const TestDynamicObservableComponent = (): JSX.Element => {
    const level = $(1)
    registerTestObservable('TestDynamicObservableComponent', level)
    const component = useMemo(() => `h${level()}`)
    const increment = () => {
        level((level() + 1) % 7 || 1)
        testit = false
    }
    useInterval(increment, TEST_INTERVAL)
    return (
        <>
            <h3>Dynamic - Observable Component</h3>
            <Dynamic component={component}>
                Level: {level}
            </Dynamic>
        </>
    )
}

TestDynamicObservableComponent.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const level = $$(testObservables['TestDynamicObservableComponent'])
        return `<h${level}>Level: ${$$(level)}</h${level}>`
    }
}


export default () => <TestSnapshots Component={TestDynamicObservableComponent} />