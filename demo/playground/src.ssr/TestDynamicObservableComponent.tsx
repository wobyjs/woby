import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestDynamicObservableComponent = (): JSX.Element => {
    const level = $(1)
    const component = useMemo(() => `h${level()}`)
    const increment = () => level((level() + 1) % 7 || 1)
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
    expect: () => '<h1>Level: 1</h1>'
}


export default () => <TestSnapshots Component={TestDynamicObservableComponent} />