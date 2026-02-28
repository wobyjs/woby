import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestClassesObjectStaticMultiple = (): JSX.Element => {
    return (
        <>
            <h3>Classes - Object Static Multiple</h3>
            <p class={{ 'red bold': true }}>content</p>
        </>
    )
}

TestClassesObjectStaticMultiple.test = {
    static: true,
    expect: () => '<p class="red bold">content</p>'
}


export default () => <TestSnapshots Component={TestClassesObjectStaticMultiple} />