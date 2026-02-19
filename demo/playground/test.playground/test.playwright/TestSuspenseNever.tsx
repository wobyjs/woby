import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestSuspenseNever = (): JSX.Element => {
    const Fallback = () => {
        return <p>Loading...</p>
    }
    const Content = () => {
        return <p>Content!</p>
    }
    return (
        <>
            <h3>Suspense - Never</h3>
            <Suspense fallback={<Fallback />}>
                <Content />
            </Suspense>
        </>
    )
}

TestSuspenseNever.test = {
    static: true,
    expect: () => '<p>Content!</p>'
}


export default () => <TestSnapshots Component={TestSuspenseNever} />