import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestSuspenseAlwaysValue = (): JSX.Element => {
    const Fallback = () => {
        return <p>Loading...</p>
    }
    const Content = () => {
        const resource = useResource(() => {
            return new Promise<undefined>(() => { })
        })
        return <p>Content! {resource.value}</p>
    }
    return (
        <>
            <h3>Suspense - Always Value</h3>
            <Suspense fallback={<Fallback />}>
                <Content />
            </Suspense>
        </>
    )
}

TestSuspenseAlwaysValue.test = {
    static: true,
    expect: () => '<p>Loading...</p>'
}


export default () => <TestSnapshots Component={TestSuspenseAlwaysValue} />