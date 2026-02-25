import { $, $$, html, If, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, random, assert } from './util'

const TestHTMLFunctionStaticRegistry = (): JSX.Element => {
    const P = (): JSX.Element => {
        return <p>content</p>
    }
    html.register({ If, P })
    const ret: JSX.Element = (
        <>
            <h3>HTML - Function - Static Registry</h3>
            {html`
        <If when=${true}>
          <P />
        </If>
      `}
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestHTMLFunctionStaticRegistry_ssr', ret)

    return ret
}

TestHTMLFunctionStaticRegistry.test = {
    static: true,
    expect: () => {
        const expected = '<p>content</p>'

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestHTMLFunctionStaticRegistry_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    const expectedFull = '<h3>HTML - Function - Static Registry</h3><p>content</p>'
                    if (ssrResult !== expectedFull) {
                        assert(false, `[TestHTMLFunctionStaticRegistry] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
                    } else {
                        console.log(`✅ [TestHTMLFunctionStaticRegistry] SSR test passed: ${ssrResult}`)
                    }
                }).catch(err => {
                    console.error(`[TestHTMLFunctionStaticRegistry] SSR render error: ${err}`)
                })
            }
        }, 0)

        return expected
    }
}


export default () => <TestSnapshots Component={TestHTMLFunctionStaticRegistry} />