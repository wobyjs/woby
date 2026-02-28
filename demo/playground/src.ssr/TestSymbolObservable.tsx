import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestSymbolObservable = (): JSX.Element => {
    const o = $(Symbol())
    const randomize = () => o(Symbol())
    useInterval(randomize, TEST_INTERVAL)
    return (
        <>
            <h3>Symbol - Observable</h3>
            <p>{o}</p>
        </>
    )
}

TestSymbolObservable.test = {
    static: true,
    expect: () => '<p><!----></p>'
}


export default () => <TestSnapshots Component={TestSymbolObservable} />