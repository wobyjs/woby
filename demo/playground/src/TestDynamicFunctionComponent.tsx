import { $, $$, Dynamic, tick } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestDynamicFunctionComponent = (): JSX.Element => {
    const level = $(1)
    registerTestObservable('TestDynamicFunctionComponent', level)
    const component = () => `h${level()}`
    const increment = () => {
        level((level() + 1) % 7 || 1)
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
        const level = $$(testObservables['TestDynamicFunctionComponent'])
        return `<h${level}>Level: ${level}</h${level}>`
    }
}


export default () => <TestSnapshots Component={TestDynamicFunctionComponent} />