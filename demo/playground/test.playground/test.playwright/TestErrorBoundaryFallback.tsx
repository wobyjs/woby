import { $, $$, ErrorBoundary } from 'woby'
import { TestSnapshots, registerTestObservable, testObservables } from './util'

const TestErrorBoundaryFallback = (): JSX.Element => {
    const ErroringComponent = (): JSX.Element => {
        throw new Error()
    }

    const FallbackComponent = ({ error }): JSX.Element => {
        return <p>Fallback: {error.message}</p>
    }

    return (
        <>
            <h3>Error Boundary - Fallback Test</h3>
            <ErrorBoundary fallback={FallbackComponent}>
                <ErroringComponent />
            </ErrorBoundary>
        </>
    )
}

TestErrorBoundaryFallback.test = {
    static: true,
    expect: () => '<p>Fallback: Error</p>'
}

export default () => <TestSnapshots Component={TestErrorBoundaryFallback} />