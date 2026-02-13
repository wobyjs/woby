import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestRenderToStringSuspense = async (): Promise<string> => {
    const App = (): JSX.Element => {
        const o = $(0)
        const Content = () => {
            const resource = useResource(() => {
                return new Promise<number>(resolve => {
                    setTimeout(() => {
                        resolve(o(123))
                    }, TEST_INTERVAL)
                })
            })
            return <p>{o}{resource.value}</p>
        }
        return (
            <div>
                <h3>renderToString - Suspense</h3>
                <Suspense>
                    <Content />
                </Suspense>
            </div>
        )
    }
    const expected = '<div><h3>renderToString - Suspense</h3><p>123123</p></div>'
    const actual = await renderToString(<App />)
    assert(actual === expected, `[TestRenderToStringSuspense]: Expected '${actual}' to be equal to '${expected}'`)
    return actual
}


export default () => <TestSnapshots Component={TestRenderToStringSuspense} />