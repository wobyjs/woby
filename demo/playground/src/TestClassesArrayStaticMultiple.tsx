import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestClassesArrayStaticMultiple = (): JSX.Element => {
    return (
        <>
            <h3>Classes - Array Static Multiple</h3>
            <p class={['red bold']}>content</p>
        </>
    )
}

TestClassesArrayStaticMultiple.test = {
    static: true,
    expect: () => '<p class="red bold">content</p>'
}


export default () => <TestSnapshots Component={TestClassesArrayStaticMultiple} />