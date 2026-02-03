import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestStringObservableStatic = (): JSX.Element => {
    const initialValue = String(random())
    registerTestObservable('TestStringObservableStatic', initialValue)
    const o = $(initialValue)
    const randomize = () => o(String(random()))
    useInterval(randomize, TEST_INTERVAL)
    return (
        <>
            <h3>String - Observable Static</h3>
            <p>{initialValue}</p>
        </>
    )
}

TestStringObservableStatic.test = {
    static: true,
    compareActualValues: true,
    expect: () => {
        const initialValue = testObservables['TestStringObservableStatic']
        return `<p>${initialValue}</p>`
    }
}


export default () => <TestSnapshots Component={TestStringObservableStatic} />