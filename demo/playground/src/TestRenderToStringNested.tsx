import { $, $$, Suspense, useResource, renderToString } from 'woby'
import { TestSnapshots, registerTestObservable, testObservables, assert } from './util'

const TestRenderToStringNested = (): JSX.Element => {
    const o = $(123)
    const Content = () => {
        const resource = useResource(() => {
            return '123<div><h3>renderToString</h3><p>123</p></div>'
        })
        return <p>{o}{resource.value}</p>
    }
    const ret: JSX.Element = (
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
        const expected = '<div><p>123123&lt;div&gt;&lt;h3&gt;renderToString&lt;/h3&gt;&lt;p&gt;123&lt;/p&gt;&lt;/div&gt;</p></div>'

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestRenderToStringNested_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    const expectedFull = '<div><h3>renderToString - Nested</h3><p>123123&lt;div&gt;&lt;h3&gt;renderToString&lt;/h3&gt;&lt;p&gt;123&lt;/p&gt;&lt;/div&gt;</p></div>'
                    if (ssrResult !== expectedFull) {
                        assert(false, `SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
                    } else {
                        console.log(`✅ SSR test passed: ${ssrResult}`)
                    }
                }).catch(err => {
                    console.error(`SSR render error: ${err}`)
                })
            }
        }, 0)

        return expected
    }
}

export default () => <TestSnapshots Component={TestRenderToStringNested} />