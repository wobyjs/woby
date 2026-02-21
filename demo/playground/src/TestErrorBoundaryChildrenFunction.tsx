import { $, $$, ErrorBoundary } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, random } from './util'

const TestErrorBoundaryChildrenFunction = (): JSX.Element => {
    const childrenValue = String(random())
    const childrenObservable = $(childrenValue)
    registerTestObservable('TestErrorBoundaryChildrenFunction', childrenObservable)
    const Children = (): JSX.Element => {
        // Remove the dynamic updating to make this truly static
        // const o = $(String(random()))
        // const randomize = () => o(String(random()))
        // useInterval(randomize, TEST_INTERVAL)
        // o()
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
    expect: () => {
        const value = $$(testObservables['TestErrorBoundaryChildrenFunction'])
        return `<p>Children: ${value}</p>`
    }
}


export default () => <TestSnapshots Component={TestErrorBoundaryChildrenFunction} />