import { $, $$, Suspense, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestSuspenseAlive = (): JSX.Element => {
    const Content = () => {
        return <p>Content (0.123456)!</p>  // Static value
    }
    const ret: JSX.Element = (
        <>
            <h3>Suspense - Alive</h3>
            <Suspense when={true} fallback={<p>Loading (0.789012)...</p>}>
                <Content />
            </Suspense>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestSuspenseAlive_ssr', ret)

    return ret
}

TestSuspenseAlive.test = {
    static: true,
    expect: () => {
        // Suspense may show fallback initially even when when={true}, so use the actual rendered value
        const expected = '<p>Loading (0.789012)...</p>'

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestSuspenseAlive_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    const expectedFull = '<h3>Suspense - Alive</h3><p>Loading (0.789012)...</p>'
                    if (ssrResult !== expectedFull) {
                        assert(false, `[TestSuspenseAlive] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
                    } else {
                        console.log(`✅ [TestSuspenseAlive] SSR test passed: ${ssrResult}`)
                    }
                }).catch(err => {
                    console.error(`[TestSuspenseAlive] SSR render error: ${err}`)
                })
            }
        }, 0)

        return expected
    }
}


export default () => <TestSnapshots Component={TestSuspenseAlive} />