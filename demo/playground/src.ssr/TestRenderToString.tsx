import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestRenderToString = async (): Promise<string> => {
    const App = (): JSX.Element => {
        const o = $(123)
        return (
            <div>
                <h3>renderToString</h3>
                <p>{o}</p>
            </div>
        )
    }
    const expected = '<div><h3>renderToString</h3><p>123</p></div>'
    const actual = await renderToString(<App />)
    assert(actual === expected, `[TestRenderToString]: Expected '${actual}' to be equal to '${expected}'`)
    return actual
}


export default () => <TestSnapshots Component={TestRenderToString} />