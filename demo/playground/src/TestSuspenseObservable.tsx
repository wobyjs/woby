import { $, $$, Suspense, useResource } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestSuspenseObservable = (): JSX.Element => {
    const Content = () => {
        return <p>Content! 123</p>  // Static content
    }
    return (
        <>
            <h3>Suspense - Observable</h3>
            <Suspense fallback={<p>Loading...</p>}>
                <Content />
            </Suspense>
        </>
    )
}

TestSuspenseObservable.test = {
    static: true,
    expect: () => '<p>Content! 123</p>'
}


export default () => <TestSnapshots Component={TestSuspenseObservable} />