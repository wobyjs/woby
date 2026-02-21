import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestSymbolStatic = (): JSX.Element => {
    return (
        <>
            <h3>Symbol - Static</h3>
            <p>{Symbol()}</p>
        </>
    )
}

TestSymbolStatic.test = {
    static: true,
    expect: () => '<p></p>'
}


export default () => <TestSnapshots Component={TestSymbolStatic} />