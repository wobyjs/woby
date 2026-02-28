import { $, $$, Suspense, useResource, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestSuspenseNeverRead = (): JSX.Element => {
    const Fallback = () => {
        return <p>Loading...</p>
    }
    const Content = () => {
        const resource = useResource(() => {
            return new Promise<undefined>(() => { })
        })
        return <p>Content!</p>
    }
    const ret: JSX.Element = (
        <>
            <h3>Suspense - Never Read</h3>
            <Suspense fallback={<Fallback />}>
                <Content />
            </Suspense>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestSuspenseNeverRead_ssr', ret)

    return ret
}

TestSuspenseNeverRead.test = {
    static: true,
    expect: () => {
        const expected = '<p>Content!</p>'

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestSuspenseNeverRead_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    const expectedFull = '<h3>Suspense - Never Read</h3><p>Content!</p>'
                    if (ssrResult !== expectedFull) {
                        assert(false, `[TestSuspenseNeverRead] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
                    } else {
                        console.log(`✅ [TestSuspenseNeverRead] SSR test passed: ${ssrResult}`)
                    }
                }).catch(err => {
                    console.error(`[TestSuspenseNeverRead] SSR render error: ${err}`)
                })
            }
        }, 0)

        return expected
    }
}


export default () => <TestSnapshots Component={TestSuspenseNeverRead} />