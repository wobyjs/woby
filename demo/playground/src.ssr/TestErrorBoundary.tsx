import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestErrorBoundary = (): JSX.Element => {
    const Erroring = (): JSX.Element => {
        const o = $(true)
        const toggle = () => o(prev => !prev)
        useTimeout(toggle, TEST_INTERVAL)
        return useMemo(() => {
            if (o()) return <p>content</p>
            throw new Error('Custom error')
        })
    }
    const Fallback = ({ error, reset }): JSX.Element => {
        useTimeout(reset, TEST_INTERVAL)
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
    static: false,
    expect: () => {
        // This component alternates between normal content and error state
        const isErrorState = Math.floor(Date.now() / TEST_INTERVAL) % 2 === 1
        return isErrorState ? '<p>Error caught: Custom error</p>' : '<p>content</p>'
    }
}


export default () => <TestSnapshots Component={TestErrorBoundary} />