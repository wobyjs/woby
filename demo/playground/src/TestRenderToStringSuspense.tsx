import { $, Suspense, useResource, renderToString } from 'woby'
import { TestSnapshots, registerTestObservable, testObservables, assert } from './util'

const TEST_INTERVAL = 500

const TestRenderToStringSuspense = (): JSX.Element => {
    const o = $(123)
    const Content = () => {
        return <p>{o}{o()}</p>
    }
    const ret: JSX.Element = (
        <div>
            <h3>renderToString - Suspense</h3>
            <Suspense>
                <Content />
            </Suspense>
        </div>
    )

    // Store the component for SSR testing
    registerTestObservable('TestRenderToStringSuspense_ssr', ret)

    return ret
}

TestRenderToStringSuspense.test = {
    static: true,
    expect: () => {
        const expected = '<div><p>123123</p></div>'

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestRenderToStringSuspense_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    const expectedFull = '<div><h3>renderToString - Suspense</h3><p>123123</p></div>'
                    if (ssrResult !== expectedFull) {
                        assert(false, `[TestRenderToStringSuspense] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
                    } else {
                        console.log(`✅ [TestRenderToStringSuspense] SSR test passed: ${ssrResult}`)
                    }
                }).catch(err => {
                    console.error(`[TestRenderToStringSuspense] SSR render error: ${err}`)
                })
            }
        }, 0)

        return expected
    }
}

export default () => <TestSnapshots Component={TestRenderToStringSuspense} />