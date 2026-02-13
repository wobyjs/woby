import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, random } from './util'

const TestNumberFunction = (): JSX.Element => {
    const o = $(random())
    registerTestObservable('TestNumberFunction', o)
    const randomize = () => o(random())
    useInterval(randomize, TEST_INTERVAL)
    return (
        <>
            <h3>Number - Function</h3>
            <p>{() => o()}</p>
        </>
    )
}

TestNumberFunction.test = {
    static: false,
    compareActualValues: true,
    expect: () => `<p>${$$(testObservables['TestNumberFunction'])}</p>`
}


export default () => <TestSnapshots Component={TestNumberFunction} />