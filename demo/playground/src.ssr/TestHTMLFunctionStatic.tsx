import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestHTMLFunctionStatic = (): JSX.Element => {
    return (
        <>
            <h3>HTML - Function - Static</h3>
            {html`
        <${If} when=${true}>
          <p>${random()}</p>
        </${If}>
      `}
        </>
    )
}

TestHTMLFunctionStatic.test = {
    static: true,
    expect: () => ''
}


export default () => <TestSnapshots Component={TestHTMLFunctionStatic} />