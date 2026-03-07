import { $, $$, Suspense, useResource, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestSuspenseAlwaysLatest = (): JSX.Element => {
    const Fallback = () => {
        return <p>Loading...</p>
    }
    const Content = () => {
        const resource = useResource(() => {
            return new Promise<undefined>(() => { })
        })
        return <p>Content! {resource.latest}</p>
    }
    const ret: JSX.Element = () => (
        <>
            <h3>Suspense - Always Latest</h3>
            <Suspense fallback={<Fallback />}>
                <Content />
            </Suspense>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestSuspenseAlwaysLatest_ssr', ret)

    return ret
}

TestSuspenseAlwaysLatest.test = {
    static: true,
    expect: () => {
        const expected = '<p>Loading...</p>'

        // Test the SSR value
        const ssrComponent = testObservables['TestSuspenseAlwaysLatest_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<h3>Suspense - Always Latest</h3><p>Loading...</p>'
        if (ssrResult !== expectedFull) {
            assert(false, `[TestSuspenseAlwaysLatest] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [TestSuspenseAlwaysLatest] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestSuspenseAlwaysLatest} />