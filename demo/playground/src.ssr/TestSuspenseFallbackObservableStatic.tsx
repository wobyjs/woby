import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestSuspenseFallbackObservableStatic = (): JSX.Element => {
    const initialValue = String(random())
    registerTestObservable('TestSuspenseFallbackObservableStatic', initialValue)
    const Children = (): JSX.Element => {
        const resource = useResource(() => {
            return new Promise<undefined>(() => { })
        })
        return <p>children {resource.value}</p>
    }
    const Fallback = (): JSX.Element => {
        return <p>Fallback: {initialValue}</p>
    }
    return (
        <>
            <h3>Suspense - Fallback Observable Static</h3>
            <Suspense fallback={<Fallback />}>
                <Children />
            </Suspense>
        </>
    )
}

TestSuspenseFallbackObservableStatic.test = {
    static: true,
    compareActualValues: true,
    expect: () => {
        const initialValue = testObservables['TestSuspenseFallbackObservableStatic']
        return `<p>Fallback: ${initialValue}</p>`
    }
}


export default () => <TestSnapshots Component={TestSuspenseFallbackObservableStatic} />