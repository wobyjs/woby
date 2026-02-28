import { $, $$, html, If, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, random, assert } from './util'

const TestHTMLFunctionStatic = (): JSX.Element => {
  const ret: JSX.Element = (
    <>
      <h3>HTML - Function - Static</h3>
      {html`
        <${If} when=${true}>
          <p>content</p>
        </${If}>
      `}
    </>
  )

  // Store the component for SSR testing
  registerTestObservable('TestHTMLFunctionStatic_ssr', ret)

  return ret
}

TestHTMLFunctionStatic.test = {
  static: true,
  expect: () => {
    const expected = '<p>content</p>'

    // Test the SSR value asynchronously
    setTimeout(() => {
      const ssrComponent = testObservables['TestHTMLFunctionStatic_ssr']
      if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
        const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
        renderToString(elementToRender).then(ssrResult => {
          const expectedFull = '<h3>HTML - Function - Static</h3><p>content</p>'
          if (ssrResult !== expectedFull) {
            assert(false, `[TestHtmlFunctionStatic] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
          } else {
            console.log(`✅ [TestHtmlFunctionStatic] SSR test passed: ${ssrResult}`)
          }
        }).catch(err => {
          console.error(`[TestHtmlFunctionStatic] SSR render error: ${err}`)
        })
      }
    }, 0)

    return expected
  }
}


export default () => <TestSnapshots Component={TestHTMLFunctionStatic} /> 