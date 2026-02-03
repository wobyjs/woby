import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestStringFunction = (): JSX.Element => {
    const o = $(String(random()))
    registerTestObservable('TestStringFunction', o)
    const randomize = () => o(String(random()))
    useInterval(randomize, TEST_INTERVAL)
    return (
        <>
            <h3>String - Function</h3>
            <p>{() => o()}</p>
        </>
    )
}

TestStringFunction.test = {
    static: false,
    compareActualValues: true,
    expect: () => `<p>${$$(testObservables['TestStringFunction'])}</p>`
}


export default () => <TestSnapshots Component={TestStringFunction} />