import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestClassesArrayStatic = (): JSX.Element => {
    return (
        <>
            <h3>Classes - Array Static</h3>
            <p class={['red', false && 'blue', null && 'blue', undefined && 'blue']}>content</p>
        </>
    )
}

TestClassesArrayStatic.test = {
    static: true,
    expect: () => '<p class="red">content</p>'
}


export default () => <TestSnapshots Component={TestClassesArrayStatic} />