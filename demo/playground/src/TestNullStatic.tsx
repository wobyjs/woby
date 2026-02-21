import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestNullStatic = (): JSX.Element => {
    return (
        <>
            <h3>Null - Static</h3>
            <p>{null}</p>
        </>
    )
}

TestNullStatic.test = {
    static: true,
    expect: () => '<p></p>'
}


export default () => <TestSnapshots Component={TestNullStatic} />