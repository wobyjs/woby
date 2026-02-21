import { $, $$, html, If } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, random } from './util'

const TestHTMLFunctionStatic = (): JSX.Element => {
  return (
    <>
      <h3>HTML - Function - Static</h3>
      {html`
        <${If} when=${true}>
          <p>content</p>
        </${If}>
      `}
    </>
  )
}

TestHTMLFunctionStatic.test = {
  static: true,
  expect: () => '<p>content</p>'
}


export default () => <TestSnapshots Component={TestHTMLFunctionStatic} /> 