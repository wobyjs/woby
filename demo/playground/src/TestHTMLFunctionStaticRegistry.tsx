import { $, $$, html, If, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, random, assert } from './util'

const TestHTMLFunctionStaticRegistry = (): JSX.Element => {
    const P = (): JSX.Element => {
        return <p>content</p>
    }
    html.register({ If, P })
    const ret: JSX.Element = () => (
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

        const ssrComponent = testObservables['TestHTMLFunctionStaticRegistry_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<h3>HTML - Function - Static Registry</h3><p>content</p>'
        if (ssrResult !== expectedFull) {
            assert(false, `[TestHTMLFunctionStaticRegistry] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestHTMLFunctionStaticRegistry] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestHTMLFunctionStaticRegistry} />