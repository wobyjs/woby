import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestDynamicFunctionComponent = (): JSX.Element => {
    const level = $(1)
    const component = () => `h${level()}`
    const increment = () => level((level() + 1) % 7 || 1)
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
    static: true,
    expect: () => 'h1'
}


export default () => <TestSnapshots Component={TestDynamicFunctionComponent} />