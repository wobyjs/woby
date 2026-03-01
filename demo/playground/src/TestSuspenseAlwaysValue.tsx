import { $, $$, Suspense, useResource, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

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
    const ret: JSX.Element = () => (
        <>
            <h3>Suspense - Always Value</h3>
            <Suspense fallback={<Fallback />}>
                <Content />
            </Suspense>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestSuspenseAlwaysValue_ssr', ret)

    return ret
}

TestSuspenseAlwaysValue.test = {
    static: true,
    expect: () => {
        const expected = '<p>Loading...</p>'

        // Test the SSR value
        const ssrComponent = testObservables['TestSuspenseAlwaysValue_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<h3>Suspense - Always Value</h3><p>Loading...</p>'
        if (ssrResult !== expectedFull) {
            assert(false, `[TestSuspenseAlwaysValue] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestSuspenseAlwaysValue] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestSuspenseAlwaysValue} />