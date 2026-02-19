import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestSuspenseNeverRead = (): JSX.Element => {
    const Fallback = () => {
        return <p>Loading...</p>
    }
    const Content = () => {
        const resource = useResource(() => {
            return new Promise<undefined>(() => { })
        })
        return <p>Content!</p>
    }
    return (
        <>
            <h3>Suspense - Never Read</h3>
            <Suspense fallback={<Fallback />}>
                <Content />
            </Suspense>
        </>
    )
}

TestSuspenseNeverRead.test = {
    static: true,
    expect: () => '<p>Content!</p>'
}


export default () => <TestSnapshots Component={TestSuspenseNeverRead} />