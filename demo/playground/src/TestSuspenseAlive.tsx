import { $, $$, Suspense } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestSuspenseAlive = (): JSX.Element => {
    const Content = () => {
        return <p>Content (0.123456)!</p>  // Static value
    }
    return (
        <>
            <h3>Suspense - Alive</h3>
            <Suspense when={true} fallback={<p>Loading (0.789012)...</p>}>
                <Content />
            </Suspense>
        </>
    )
}

TestSuspenseAlive.test = {
    static: true,
    expect: () => '<p>Loading (0.789012)...</p>'  // Match the actual content
}


export default () => <TestSnapshots Component={TestSuspenseAlive} />