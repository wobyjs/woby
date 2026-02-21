import { $, $$, ErrorBoundary } from 'woby'
import { TestSnapshots, registerTestObservable, testObservables } from './util'

const TestErrorBoundaryNoError = (): JSX.Element => {
    const ErroringComponent = (): JSX.Element => {
        return <p>Normal content</p>
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

TestErrorBoundaryNoError.test = {
    static: true,
    expect: () => '<p>Normal content</p>'
}

export default () => <TestSnapshots Component={TestErrorBoundaryNoError} />