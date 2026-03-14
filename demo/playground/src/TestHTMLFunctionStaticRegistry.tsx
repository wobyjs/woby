import { $, $$, html, If, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, random, assert } from './util'

const name = 'TestHTMLFunctionStaticRegistry'
const TestHTMLFunctionStaticRegistry = (): JSX.Element => {
    const name = 'P'
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
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}

TestHTMLFunctionStaticRegistry.test = {
    static: true,
    expect: () => {
        const expected = '<p>content</p>'

        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<h3>HTML - Function - Static Registry</h3><p>content</p>'
        if (ssrResult !== expectedFull) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ ${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestHTMLFunctionStaticRegistry} />