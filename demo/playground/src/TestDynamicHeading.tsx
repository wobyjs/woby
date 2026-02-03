import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestDynamicHeading = (): JSX.Element => {
    const level = $<1 | 2 | 3 | 4 | 5 | 6>(1)
    const increment = () => level((level() + 1) % 7 || 1)
    useInterval(increment, TEST_INTERVAL)
    return (
        <>
            <h3>Dynamic - Heading</h3>
            {() => (
                <Dynamic component={`h${level()}`}>
                    Level: {level}
                </Dynamic>
            )}
        </>
    )
}

TestDynamicHeading.test = {
    static: false,
    expect: () => '<h1>Level: 1</h1>'
}


export default () => <TestSnapshots Component={TestDynamicHeading} />