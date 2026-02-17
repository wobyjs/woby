import { $, $$, html, If } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, random } from './util'

const TestHTMLFunctionStaticRegistry = (): JSX.Element => {
    const P = (): JSX.Element => {
        return <p>{random()}</p>
    }
    html.register({ If, P })
    return (
        <>
            <h3>HTML - Function - Static Registry</h3>
            {html`
        <If when=${true}>
          <P />
        </If>
      `}
        </>
    )
}

TestHTMLFunctionStaticRegistry.test = {
    static: true,
    expect: () => ''
}


export default () => <TestSnapshots Component={TestHTMLFunctionStaticRegistry} />