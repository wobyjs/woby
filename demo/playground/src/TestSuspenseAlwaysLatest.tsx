import { $, $$, Suspense, useResource, renderToString } from 'woby'
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
    const ret: JSX.Element = (
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

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestSuspenseAlwaysLatest_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    const expectedFull = '<h3>Suspense - Always Latest</h3><p>Loading...</p>'
                    if (ssrResult !== expectedFull) {
                        assert(false, `[TestSuspenseAlwaysLatest] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
                    } else {
                        console.log(`✅ [TestSuspenseAlwaysLatest] SSR test passed: ${ssrResult}`)
                    }
                }).catch(err => {
                    console.error(`[TestSuspenseAlwaysLatest] SSR render error: ${err}`)
                })
            }
        }, 0)

        return expected
    }
}


export default () => <TestSnapshots Component={TestSuspenseAlwaysLatest} />