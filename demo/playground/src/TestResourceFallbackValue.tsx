import { $, $$, ErrorBoundary, If, useResource, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const name = 'TestResourceFallbackValue'
const TestResourceFallbackValue = (): JSX.Element => {
    const resource = useResource(() => { throw new Error('Some error') })
    const ret: JSX.Element = () => (
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

    // Store the component for SSR testing
    registerTestObservable('TestResourceFallbackValue_ssr', ret)

    return ret
}

TestResourceFallbackValue.test = {
    static: true,
    expect: () => {
        const expected = '<p>Error!</p><p>Error!</p>'

        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<h3>Resource - Fallback Value</h3><p>Error!</p><p>Error!</p>'
        if (ssrResult !== expectedFull) {
            assert(false, `${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ ${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestResourceFallbackValue} />