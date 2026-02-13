import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestErrorBoundaryFallbackObservableStatic = (): JSX.Element => {
    const Children = (): JSX.Element => {
        throw new Error()
    }
    const fallbackValue = String(random())
    registerTestObservable('TestErrorBoundaryFallbackObservableStatic', fallbackValue)
    const Fallback = (): JSX.Element => {
        const o = $(String(random()))
        const randomize = () => o(String(random()))
        useInterval(randomize, TEST_INTERVAL)
        o()
        return <p>Fallback: {fallbackValue}</p>
    }
    return (
        <>
            <h3>Error Boundary - Fallback Observable Static</h3>
            <ErrorBoundary fallback={<Fallback />}>
                <Children />
            </ErrorBoundary>
        </>
    )
}

TestErrorBoundaryFallbackObservableStatic.test = {
    static: true,
    compareActualValues: true,
    expect: () => {
        const fallbackValue = testObservables['TestErrorBoundaryFallbackObservableStatic']
        return `<p>Fallback: ${fallbackValue}</p>`
    }
}


export default () => <TestSnapshots Component={TestErrorBoundaryFallbackObservableStatic} />