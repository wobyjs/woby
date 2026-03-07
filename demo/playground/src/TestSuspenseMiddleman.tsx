import { $, $$, Suspense, useResource, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestSuspenseMiddleman = (): JSX.Element => {
    const Content = () => {
        return <p>Middleman!</p>  // Static content
    }
    const ret: JSX.Element = () => (
        <>
            <h3>Suspense - Middleman</h3>
            <Suspense fallback={<p>Loading...</p>}>
                <Content />
            </Suspense>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestSuspenseMiddleman_ssr', ret)

    return ret
}

TestSuspenseMiddleman.test = {
    static: true,
    expect: () => {
        const expected = '<p>Middleman!</p>'

        // Test the SSR value
        const ssrComponent = testObservables['TestSuspenseMiddleman_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<h3>Suspense - Middleman</h3><p>Middleman!</p>'
        if (ssrResult !== expectedFull) {
            assert(false, `[TestSuspenseMiddleman] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [TestSuspenseMiddleman] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestSuspenseMiddleman} />