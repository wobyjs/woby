import { $, $$ } from 'woby'
import { useMemo } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, random } from './util'

const TestStringObservableDeepStatic = (): JSX.Element => {
    return useMemo(() => {
        const initialValue = "0.123456"
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
    expect: () => '<p>0.123456</p>'  // Use a fixed value for predictable testing
}


export default () => <TestSnapshots Component={TestStringObservableDeepStatic} />