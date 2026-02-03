import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestErrorBoundaryChildrenObservableStatic = (): JSX.Element => {
    const childrenValue = String(random())
    registerTestObservable('TestErrorBoundaryChildrenObservableStatic', childrenValue)
    const Children = (): JSX.Element => {
        const o = $(String(random()))
        const randomize = () => o(String(random()))
        useInterval(randomize, TEST_INTERVAL)
        o()
        return <p>Children: {childrenValue}</p>
    }
    const Fallback = (): JSX.Element => {
        return <p>Fallback!</p>
    }
    return (
        <>
            <h3>Error Boundary - Children Observable Static</h3>
            <ErrorBoundary fallback={<Fallback />}>
                <Children />
            </ErrorBoundary>
        </>
    )
}

TestErrorBoundaryChildrenObservableStatic.test = {
    static: true,
    compareActualValues: true,
    expect: () => {
        const childrenValue = testObservables['TestErrorBoundaryChildrenObservableStatic']
        return `<p>Children: ${childrenValue}</p>`
    }
}


export default () => <TestSnapshots Component={TestErrorBoundaryChildrenObservableStatic} />