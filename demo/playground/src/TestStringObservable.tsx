import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestStringObservable = (): JSX.Element => {
    const o = $(String(random()))
    registerTestObservable('TestStringObservable', o)
    const randomize = () => o(String(random()))
    useInterval(randomize, TEST_INTERVAL)
    return (
        <>
            <h3>String - Observable</h3>
            <p>{o}</p>
        </>
    )
}

TestStringObservable.test = {
    static: false,
    compareActualValues: true,
    expect: () => `<p>${$$(testObservables['TestStringObservable'])}</p>`
}


export default () => <TestSnapshots Component={TestStringObservable} />