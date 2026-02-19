import { $, $$, Suspense } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestSuspenseWhen = (): JSX.Element => {
    const Content = () => {
        return <p>Content!</p>
    }
    return (
        <>
            <h3>Suspense - When</h3>
            <Suspense when={true} fallback={<p>Loading...</p>}>
                <Content />
            </Suspense>
        </>
    )
}

TestSuspenseWhen.test = {
    static: true,
    expect: () => '<p>Loading...</p>'  // Match the actual content
}


export default () => <TestSnapshots Component={TestSuspenseWhen} />