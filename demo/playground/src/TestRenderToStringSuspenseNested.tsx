import { $, $$, Suspense, useResource, renderToString } from 'woby'
import { TestSnapshots, registerTestObservable, testObservables, assert } from './util'

const TEST_INTERVAL = 500

const TestRenderToStringSuspenseNested = (): JSX.Element => {
    const o = $(123)
    const Content = () => {
        return <p>{o}{o()}</p>
    }
    const ret: JSX.Element = () => (
        <div>
            <h3>renderToString - Suspense Nested</h3>
            <Suspense>
                <Content />
                <Suspense>
                    <Content />
                </Suspense>
            </Suspense>
        </div>
    )

    // Store the component for SSR testing
    registerTestObservable('TestRenderToStringSuspenseNested_ssr', ret)

    return ret
}

TestRenderToStringSuspenseNested.test = {
    static: true,
    expect: () => {
        const expected = '<div><p>123123</p><p>123123</p></div>'

        const ssrComponent = testObservables['TestRenderToStringSuspenseNested_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<div><h3>renderToString - Suspense Nested</h3><p>123123</p><p>123123</p></div>'
        if (ssrResult !== expectedFull) {
            assert(false, `[TestRenderToStringSuspenseNested] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestRenderToStringSuspenseNested] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestRenderToStringSuspenseNested} />