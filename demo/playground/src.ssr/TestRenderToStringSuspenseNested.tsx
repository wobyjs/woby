import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestRenderToStringSuspenseNested = async (): Promise<string> => {
    const App = (): JSX.Element => {
        const o = $(0)
        const Content = (timeout) => {
            const resource = useResource(() => {
                return new Promise<number>(resolve => {
                    setTimeout(() => {
                        resolve(o(123))
                    }, timeout)
                })
            })
            return <p>{o}{resource.value}</p>
        }
        return (
            <div>
                <h3>renderToString - Suspense Nested</h3>
                <Suspense>
                    <Content interval={TEST_INTERVAL} />
                    <Suspense>
                        <Content interval={TEST_INTERVAL * 2} />
                    </Suspense>
                </Suspense>
            </div>
        )
    }
    const expected = '<div><h3>renderToString - Suspense Nested</h3><p>123123</p><p>123123</p></div>'
    const actual = await renderToString(<App />)
    assert(actual === expected, `[TestRenderToStringSuspenseNested]: Expected '${actual}' to be equal to '${expected}'`)
    return actual
}


export default () => <TestSnapshots Component={TestRenderToStringSuspenseNested} />