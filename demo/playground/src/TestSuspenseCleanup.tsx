import { $, $$, Suspense, useResource, Ternary, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestSuspenseCleanup = (): JSX.Element => {
    const ChildrenPlain = () => {
        return <p>Loaded!</p>
    }
    const ret: JSX.Element = () => (
        <>
            <h3>Suspense - Cleanup</h3>
            <Suspense fallback={<p>Loading...</p>}>
                <ChildrenPlain />
            </Suspense>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestSuspenseCleanup_ssr', ret)

    return ret
}

TestSuspenseCleanup.test = {
    static: true,
    expect: () => {
        const expected = '<p>Loaded!</p>'

        // Test the SSR value
        const ssrComponent = testObservables['TestSuspenseCleanup_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<h3>Suspense - Cleanup</h3><p>Loaded!</p>'
        if (ssrResult !== expectedFull) {
            assert(false, `[TestSuspenseCleanup] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestSuspenseCleanup] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestSuspenseCleanup} />