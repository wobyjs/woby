import { $, $$, ErrorBoundary, If, useResource, renderToString, renderT, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const name = 'TestResourceFallbackLatest'
const TestResourceFallbackLatest = (): JSX.Element => {
    const ret: JSX.Element = () => {
        const resource = useResource(() => { throw new Error('Some error') })
        return (
            <>
                <h3>Resource - Fallback Latest</h3>
                <ErrorBoundary fallback={<p>Error!</p>}>
                    <If when={() => resource().latest} fallback={<p>Loading!</p>}>
                        <p>Loaded!</p>
                    </If>
                </ErrorBoundary>
                <ErrorBoundary fallback={<p>Error!</p>}>
                    <If when={resource.latest} fallback={<p>Loading!</p>}>
                        <p>Loaded!</p>
                    </If>
                </ErrorBoundary>
            </>
        )
    }

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}

TestResourceFallbackLatest.test = {
    static: true,
    expect: () => {
        const expected = '<p>Error!</p><p>Error!</p>'
        //<h3>Resource - Fallback Latest</h3><p>Loading!</p><p>Loading!</p>
        //<h3>Resource - Fallback Latest</h3><p>Error!</p><p>Error!</p>

        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<h3>Resource - Fallback Latest</h3><p>Error!</p><p>Error!</p>'
        if (ssrResult !== expectedFull) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestResourceFallbackLatest} />

// console.log(renderToString(<TestResourceFallbackLatest />))