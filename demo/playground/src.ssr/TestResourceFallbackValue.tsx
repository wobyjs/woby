import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestResourceFallbackValue = (): JSX.Element => {
    const resource = useResource(() => { throw new Error('Some error') })
    return (
        <>
            <h3>Resource - Fallback Value</h3>
            <ErrorBoundary fallback={<p>Error!</p>}>
                <If when={() => resource().value} fallback={<p>Loading!</p>}>
                    <p>Loaded!</p>
                </If>
            </ErrorBoundary>
            <ErrorBoundary fallback={<p>Error!</p>}>
                <If when={resource.value} fallback={<p>Loading!</p>}>
                    <p>Loaded!</p>
                </If>
            </ErrorBoundary>
        </>
    )
}

TestResourceFallbackValue.test = {
    static: true,
    expect: () => '<p>Error!</p><p>Error!</p>'
}


export default () => <TestSnapshots Component={TestResourceFallbackValue} />