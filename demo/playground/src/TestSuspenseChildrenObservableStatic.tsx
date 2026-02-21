import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestSuspenseChildrenObservableStatic = (): JSX.Element => {
    const initialValue = useMemo(() => String(random()))
    registerTestObservable('TestSuspenseChildrenObservableStatic', initialValue)
    const Children = (): JSX.Element => {
        return <p>Children: {initialValue}</p>
    }
    const Fallback = (): JSX.Element => {
        return <p>Fallback!</p>
    }
    return (
        <>
            <h3>Suspense - Children Observable Static</h3>
            <Suspense fallback={<Fallback />}>
                <Children />
            </Suspense>
        </>
    )
}

TestSuspenseChildrenObservableStatic.test = {
    static: true,
    compareActualValues: true,
    expect: () => {
        const initialValue = $$(testObservables['TestSuspenseChildrenObservableStatic'])
        return `<p>Children: ${initialValue}</p>`
    }
}


export default () => <TestSnapshots Component={TestSuspenseChildrenObservableStatic} />