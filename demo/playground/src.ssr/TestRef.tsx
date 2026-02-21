import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestRef = (): JSX.Element => {
    const ref = $<HTMLElement>()
    useEffect(() => {
        const element = ref()
        if (!element) return
        element.textContent = `Got ref - Has parent: ${!!ref()?.parentElement} - Is connected: ${!!ref()?.isConnected}`
    }, { sync: true })
    return (
        <>
            <h3>Ref</h3>
            <p ref={ref}>content</p>
        </>
    )
}

TestRef.test = {
    static: true,
    expect: () => '<p>Got ref - Has parent: true - Is connected: true</p>'
}


export default () => <TestSnapshots Component={TestRef} />