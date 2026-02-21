import { $, $$, useMemo, ErrorBoundary } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, useTimeout } from './util'

const TestErrorBoundary = (): JSX.Element => {
    const Erroring = (): JSX.Element => {
        // Immediately throw error for predictable test
        throw new Error('Custom error')
    }
    const Fallback = ({ error }): JSX.Element => {
        return <p>Error caught: {error.message}</p>
    }
    return (
        <>
            <h3>Error Boundary</h3>
            <ErrorBoundary fallback={Fallback}>
                <Erroring />
            </ErrorBoundary>
        </>
    )
}

TestErrorBoundary.test = {
    static: true,
    compareActualValues: true,
    expect: () => '<p>Error caught: Custom error</p>'
}


export default () => <TestSnapshots Component={TestErrorBoundary} />