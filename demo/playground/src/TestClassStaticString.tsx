import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestClassStaticString = (): JSX.Element => {
    return (
        <>
            <h3>Class - Static String</h3>
            <p class="red">content</p>
        </>
    )
}

TestClassStaticString.test = {
    static: true,
    expect: () => '<p class="red">content</p>'
}


export default () => <TestSnapshots Component={TestClassStaticString} />