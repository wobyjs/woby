import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestTabIndexBooleanObservable = (): JSX.Element => {
    return (
        <>
            <h3>TabIndex - Boolean - Observable</h3>
            <p tabIndex={0}>content</p>
        </>
    )
}

TestTabIndexBooleanObservable.test = {
    static: true,
    expect: () => '<p tabindex="0">content</p>'
}


export default () => <TestSnapshots Component={TestTabIndexBooleanObservable} />