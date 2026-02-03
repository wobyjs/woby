import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestNumberObservable = (): JSX.Element => {
    const o = $(random())
    registerTestObservable('TestNumberObservable', o)
    const randomize = () => o(random())
    useInterval(randomize, TEST_INTERVAL)
    return (
        <>
            <h3>Number - Observable</h3>
            <p>{o}</p>
        </>
    )
}

TestNumberObservable.test = {
    static: false,
    compareActualValues: true,
    expect: () => `<p>${$$(testObservables['TestNumberObservable'])}</p>`
}


export default () => <TestSnapshots Component={TestNumberObservable} />