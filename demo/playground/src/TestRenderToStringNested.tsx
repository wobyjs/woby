import { $, $$, Suspense, useResource, renderToString, type JSX } from 'woby'
import { TestSnapshots, registerTestObservable, testObservables, assert } from './util'

const TestRenderToStringNested = (): JSX.Element => {
    const o = $(123)
    const Content = () => {
        const resource = useResource(() => {
            return '123<div><h3>renderToString</h3><p>123</p></div>'
        })
        return <p>{o}{resource.value}</p>
    }
    const ret: JSX.Element = () => (
        <div>
            <h3>renderToString - Nested</h3>
            <Suspense>
                <Content />
            </Suspense>
        </div>
    )

    // Store the component for SSR testing
    registerTestObservable('TestRenderToStringNested_ssr', ret)

    return ret
}

TestRenderToStringNested.test = {
    static: true,
    expect: () => {
        const expectedForDOM = '<div><p>123123<div><h3>renderToString</h3><p>123</p></div></p></div>'
        const expectedForSSR = '<div><h3>renderToString - Nested</h3><p>123123<div><h3>renderToString</h3><p>123</p></div></p></div>'

        const ssrComponent = testObservables['TestRenderToStringNested_ssr']
        const ssrResult = renderToString(ssrComponent)

        if (ssrResult !== expectedForSSR) {
            assert(false, `[TestRenderToStringNested] SSR mismatch: got \n${ssrResult}, expected \n${expectedForSSR}`)
        } else {
            console.log(`✅ [TestRenderToStringNested] SSR test passed: ${ssrResult}`)
        }

        return expectedForDOM
    }
}

export default () => <TestSnapshots Component={TestRenderToStringNested} />
