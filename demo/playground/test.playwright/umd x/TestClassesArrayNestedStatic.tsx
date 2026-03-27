import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestClassesArrayNestedStatic = (): JSX.Element => {
    const o = $(['red', ['bold', { 'italic': true }]])
    return (
        <>
            <h3>Classes - Array Nested Static</h3>
            <p class={o}>content</p>
        </>
    )
}

TestClassesArrayNestedStatic.test = {
    static: true,
    expect: () => '<p class="red bold italic">content</p>'
}


export default () => <TestSnapshots Component={TestClassesArrayNestedStatic} />