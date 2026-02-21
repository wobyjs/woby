import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestLazy = (): JSX.Element => {
    const Component = (): JSX.Element => {
        return <p>Loaded!</p>
    }
    const Fallback = (): JSX.Element => {
        return <p>Loading...</p>
    }
    const isLoading = $(true)
    // Store the observable globally so the test can access it
    registerTestObservable('TestLazy', isLoading)
    const lazyFetcher = () => new Promise<{ default: JSX.Component }>(resolve => {
        setTimeout(() => {
            isLoading(false) // Mark as loaded when promise resolves
            resolve({ default: Component })
        }, TEST_INTERVAL)
    })
    const LazyComponent = lazy(lazyFetcher)
    return (
        <>
            <h3>Lazy</h3>
            <Suspense fallback={<Fallback />}>
                <LazyComponent />
            </Suspense>
        </>
    )
}

TestLazy.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const isLoading = $$(testObservables['TestLazy'])
        return isLoading ? '<p>Loading...</p>' : '<p>Loaded!</p>'
    }
}


export default () => <TestSnapshots Component={TestLazy} />