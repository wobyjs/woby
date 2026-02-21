import { $, $$, Suspense, useResource, Ternary } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestSuspenseCleanup = (): JSX.Element => {
    const ChildrenPlain = () => {
        return <p>Loaded!</p>
    }
    return (
        <>
            <h3>Suspense - Cleanup</h3>
            <Suspense fallback={<p>Loading...</p>}>
                <ChildrenPlain />
            </Suspense>
        </>
    )
}

TestSuspenseCleanup.test = {
    static: true,
    expect: () => '<p>Loaded!</p>'
}


export default () => <TestSnapshots Component={TestSuspenseCleanup} />