import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestStringObservableDeepStatic = (): JSX.Element => {
    return useMemo(() => {
        const initialValue = String(random())
        registerTestObservable('TestStringObservableDeepStatic', initialValue)
        const o = $(initialValue)
        const randomize = () => o(String(random()))
        useInterval(randomize, TEST_INTERVAL)
        const Deep = (): JSX.Element => {
            return (
                <>
                    <h3>String - Observable Deep Static</h3>
                    <p>{initialValue}</p>
                </>
            )
        }
        return <Deep />
    })
}

TestStringObservableDeepStatic.test = {
    static: true,
    compareActualValues: true,
    expect: () => {
        const initialValue = testObservables['TestStringObservableDeepStatic']
        return `<p>${initialValue}</p>`
    }
}


export default () => <TestSnapshots Component={TestStringObservableDeepStatic} />