import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestClassStatic = (): JSX.Element => {
    return (
        <>
            <h3>Class - Static</h3>
            <p class={{ red: true, blue: false }}>content</p>
        </>
    )
}

TestClassStatic.test = {
    static: true,
    expect: () => '<p class="red">content</p>'
}


export default () => <TestSnapshots Component={TestClassStatic} />