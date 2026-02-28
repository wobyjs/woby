import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestErrorBoundaryFallbackFunction = (): JSX.Element => {
    const Children = (): JSX.Element => {
        throw new Error()
    }
    const fallbackValue = String(random())
    registerTestObservable('TestErrorBoundaryFallbackFunction', fallbackValue)
    const Fallback = (): JSX.Element => {
        const o = $(String(random()))
        const randomize = () => o(String(random()))
        useInterval(randomize, TEST_INTERVAL)
        o()
        return <p>Fallback: {fallbackValue}</p>
    }
    return (
        <>
            <h3>Error Boundary - Fallback Function</h3>
            <ErrorBoundary fallback={Fallback}>
                <Children />
            </ErrorBoundary>
        </>
    )
}

TestErrorBoundaryFallbackFunction.test = {
    static: true,
    compareActualValues: true,
    expect: () => {
        const fallbackValue = testObservables['TestErrorBoundaryFallbackFunction']
        return `<p>Fallback: ${fallbackValue}</p>`
    }
}


export default () => <TestSnapshots Component={TestErrorBoundaryFallbackFunction} />