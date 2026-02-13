import { $, $$ } from 'woby'
import { useMemo } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, random } from './util'

const TestStringObservableDeepStatic = (): JSX.Element => {
    return useMemo(() => {
        const initialValue = String(random())
        // For static test, we don't need to register an observable that changes
        const o = $(initialValue)
        // Don't use interval for static test
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
    // For static tests, don't use compareActualValues since we can't predict random values
}


export default () => <TestSnapshots Component={TestStringObservableDeepStatic} />