import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestSuspenseAlwaysLatest = (): JSX.Element => {
    const Fallback = () => {
        return <p>Loading...</p>
    }
    const Content = () => {
        const resource = useResource(() => {
            return new Promise<undefined>(() => { })
        })
        return <p>Content! {resource.latest}</p>
    }
    return (
        <>
            <h3>Suspense - Always Latest</h3>
            <Suspense fallback={<Fallback />}>
                <Content />
            </Suspense>
        </>
    )
}

TestSuspenseAlwaysLatest.test = {
    static: true,
    expect: () => '<p>Loading...</p>'
}


export default () => <TestSnapshots Component={TestSuspenseAlwaysLatest} />