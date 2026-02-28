import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestSuspenseChildrenFunction = (): JSX.Element => {
    const initialValue = String(random())
    registerTestObservable('TestSuspenseChildrenFunction', initialValue)
    const Children = (): JSX.Element => {
        return <p>Children: {initialValue}</p>
    }
    const Fallback = (): JSX.Element => {
        return <p>Fallback!</p>
    }
    return (
        <>
            <h3>Suspense - Children Function</h3>
            <Suspense fallback={<Fallback />}>
                {Children}
            </Suspense>
        </>
    )
}

TestSuspenseChildrenFunction.test = {
    static: true,
    compareActualValues: true,
    expect: () => {
        const initialValue = testObservables['TestSuspenseChildrenFunction']
        return `<p>Children: ${initialValue}</p>`
    }
}


export default () => <TestSnapshots Component={TestSuspenseChildrenFunction} />