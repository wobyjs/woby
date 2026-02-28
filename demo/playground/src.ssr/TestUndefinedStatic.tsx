import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestUndefinedStatic = (): JSX.Element => {
    return (
        <>
            <h3>Undefined - Static</h3>
            <p>{undefined}</p>
        </>
    )
}

TestUndefinedStatic.test = {
    static: true,
    expect: () => '<p></p>'
}


export default () => <TestSnapshots Component={TestUndefinedStatic} />