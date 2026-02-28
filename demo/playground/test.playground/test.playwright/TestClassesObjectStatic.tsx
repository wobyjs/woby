import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestClassesObjectStatic = (): JSX.Element => {
    return (
        <>
            <h3>Classes - Object Static</h3>
            <p class={{ red: true, blue: false }}>content</p>
        </>
    )
}

TestClassesObjectStatic.test = {
    static: true,
    expect: () => '<p class="red">content</p>'
}


export default () => <TestSnapshots Component={TestClassesObjectStatic} />