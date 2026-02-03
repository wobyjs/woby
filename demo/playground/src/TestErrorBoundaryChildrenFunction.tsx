import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestErrorBoundaryChildrenFunction = (): JSX.Element => {
    const childrenValue = String(random())
    registerTestObservable('TestErrorBoundaryChildrenFunction', childrenValue)
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
            <h3>Error Boundary - Children Function</h3>
            <ErrorBoundary fallback={<Fallback />}>
                {Children}
            </ErrorBoundary>
        </>
    )
}

TestErrorBoundaryChildrenFunction.test = {
    static: true,
    compareActualValues: true,
    expect: () => {
        const childrenValue = testObservables['TestErrorBoundaryChildrenFunction']
        return `<p>Children: ${childrenValue}</p>`
    }
}


export default () => <TestSnapshots Component={TestErrorBoundaryChildrenFunction} />