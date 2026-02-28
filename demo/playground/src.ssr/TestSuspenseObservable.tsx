import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestSuspenseObservable = (): JSX.Element => {
    const Fallback = () => {
        return <p>Loading...</p>
    }
    const Content = () => {
        const o = $(0)
        const resource = useResource(() => {
            o()
            return new Promise<number>(resolve => {
                setTimeout(() => {
                    resolve(123)
                }, TEST_INTERVAL / 2)
            })
        })
        const refetch = () => o(prev => prev + 1)
        useInterval(refetch, TEST_INTERVAL)
        return <p>Content! {resource.value}</p>
    }
    return (
        <>
            <h3>Suspense - Observable</h3>
            <Suspense fallback={<Fallback />}>
                <Content />
            </Suspense>
        </>
    )
}

TestSuspenseObservable.test = {
    static: false,
    compareActualValues: true,
    expect: () => '<p>Loading...</p>'
}


export default () => <TestSnapshots Component={TestSuspenseObservable} />