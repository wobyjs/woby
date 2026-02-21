import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestRenderToStringNested = async (): Promise<string> => {
    const App = (): JSX.Element => {
        const o = $(123)
        const Content = () => {
            const resource = useResource(async () => {
                return await TestRenderToString()
            })
            return <p>{o}{resource.value}</p>
        }
        return (
            <div>
                <h3>renderToString - Nested</h3>
                <Suspense>
                    <Content />
                </Suspense>
            </div>
        )
    }
    const expected = '<div><h3>renderToString - Nested</h3><p>123&lt;div&gt;&lt;h3&gt;renderToString&lt;/h3&gt;&lt;p&gt;123&lt;/p&gt;&lt;/div&gt;</p></div>'
    const actual = await renderToString(<App />)
    assert(actual === expected, `[TestRenderToStringNested]: Expected '${actual}' to be equal to '${expected}'`)
    return actual
}


export default () => <TestSnapshots Component={TestRenderToStringNested} />