import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestSymbolRemoval = (): JSX.Element => {
    return (
        <>
            <h3>Symbol - Removal</h3>
            <p>()</p>
        </>
    )
}

TestSymbolRemoval.test = {
    static: true,
    expect: () => '<p>()</p>'
}


export default () => <TestSnapshots Component={TestSymbolRemoval} />