import { $, $$, Suspense, useResource } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestSuspenseMiddleman = (): JSX.Element => {
    const Content = () => {
        return <p>Middleman!</p>  // Static content
    }
    return (
        <>
            <h3>Suspense - Middleman</h3>
            <Suspense fallback={<p>Loading...</p>}>
                <Content />
            </Suspense>
        </>
    )
}

TestSuspenseMiddleman.test = {
    static: true,
    expect: () => '<p>Middleman!</p>'
}


export default () => <TestSnapshots Component={TestSuspenseMiddleman} />