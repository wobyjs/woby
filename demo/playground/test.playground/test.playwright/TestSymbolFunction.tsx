import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestSymbolFunction = (): JSX.Element => {
    const o = $(Symbol())
    const randomize = () => o(Symbol())
    useInterval(randomize, TEST_INTERVAL)
    return (
        <>
            <h3>Symbol - Function</h3>
            <p>{() => o()}</p>
        </>
    )
}

TestSymbolFunction.test = {
    static: true,
    expect: () => '<p><!----></p>'
}


export default () => <TestSnapshots Component={TestSymbolFunction} />