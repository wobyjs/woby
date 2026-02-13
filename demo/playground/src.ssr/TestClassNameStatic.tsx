import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestClassNameStatic = (): JSX.Element => {
    return (
        <>
            <h3>ClassName - Static</h3>
            <p class="red">content</p>
        </>
    )
}

TestClassNameStatic.test = {
    static: true,
    expect: () => '<p class="red">content</p>'
}


export default () => <TestSnapshots Component={TestClassNameStatic} />