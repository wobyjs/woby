import { $, $$, Suspense, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestSuspenseNever = (): JSX.Element => {
    const Fallback = () => {
        return <p>Loading...</p>
    }
    const Content = () => {
        return <p>Content!</p>
    }
    const ret: JSX.Element = () => (
        <>
            <h3>Suspense - Never</h3>
            <Suspense fallback={<Fallback />}>
                <Content />
            </Suspense>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestSuspenseNever_ssr', ret)

    return ret
}

TestSuspenseNever.test = {
    static: true,
    expect: () => {
        const expected = '<p>Content!</p>'

        // Test the SSR value
        const ssrComponent = testObservables['TestSuspenseNever_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<h3>Suspense - Never</h3><p>Content!</p>'
        if (ssrResult !== expectedFull) {
            assert(false, `[TestSuspenseNever] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestSuspenseNever] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestSuspenseNever} />