import { $, $$, Suspense, useResource, Ternary, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestSuspenseCleanup = (): JSX.Element => {
    const ChildrenPlain = () => {
        return <p>Loaded!</p>
    }
    const ret: JSX.Element = (
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

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestSuspenseCleanup_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    const expectedFull = '<h3>Suspense - Cleanup</h3><p>Loaded!</p>'
                    if (ssrResult !== expectedFull) {
                        assert(false, `[TestSuspenseCleanup] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
                    } else {
                        console.log(`✅ [TestSuspenseCleanup] SSR test passed: ${ssrResult}`)
                    }
                }).catch(err => {
                    console.error(`[TestSuspenseCleanup] SSR render error: ${err}`)
                })
            }
        }, 0)

        return expected
    }
}


export default () => <TestSnapshots Component={TestSuspenseCleanup} />