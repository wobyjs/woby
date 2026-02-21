import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestSuspenseFallbackFunction = (): JSX.Element => {
    const initialValue = String(random())
    registerTestObservable('TestSuspenseFallbackFunction', initialValue)
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
            <h3>Suspense - Fallback Function</h3>
            <Suspense fallback={Fallback}>
                <Children />
            </Suspense>
        </>
    )
}

TestSuspenseFallbackFunction.test = {
    static: true,
    compareActualValues: true,
    expect: () => {
        const initialValue = testObservables['TestSuspenseFallbackFunction']
        return `<p>Fallback: ${initialValue}</p>`
    }
}


export default () => <TestSnapshots Component={TestSuspenseFallbackFunction} />