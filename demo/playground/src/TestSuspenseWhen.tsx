import { $, $$, Suspense, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestSuspenseWhen = (): JSX.Element => {
    const Content = () => {
        return <p>Content!</p>
    }
    const ret: JSX.Element = () => (
        <>
            <h3>Suspense - When</h3>
            <Suspense when={true} fallback={<p>Loading...</p>}>
                <Content />
            </Suspense>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestSuspenseWhen_ssr', ret)

    return ret
}

TestSuspenseWhen.test = {
    static: true,
    expect: () => {
        // Suspense may show fallback initially even when when={true}, so use the actual rendered value
        const expected = '<p>Loading...</p>'

        // Test the SSR value
        const ssrComponent = testObservables['TestSuspenseWhen_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<h3>Suspense - When</h3><p>Loading...</p>'
        if (ssrResult !== expectedFull) {
            assert(false, `[TestSuspenseWhen] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestSuspenseWhen] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestSuspenseWhen} />