import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestTabIndexBooleanFunction = (): JSX.Element => {
    return (
        <>
            <h3>TabIndex - Boolean - Function</h3>
            <p tabIndex={0}>content</p>
        </>
    )
}

TestTabIndexBooleanFunction.test = {
    static: true,
    expect: () => '<p tabindex="0">content</p>'
}


export default () => <TestSnapshots Component={TestTabIndexBooleanFunction} />