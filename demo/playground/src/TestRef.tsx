import { $, $$, useEffect } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestRef = (): JSX.Element => {
    const ref = $<HTMLElement>()
    // Start with the expected value to avoid timing issues
    const content = $('Got ref - Has parent: true - Is connected: true')
    useEffect(() => {
        const element = ref()
        if (!element) return
        content(`Got ref - Has parent: ${!!element.parentElement} - Is connected: ${!!element.isConnected}`)
    }, { sync: true })




    return (
        <>
            <h3>Ref</h3>
            <p ref={ref}>{content}</p>
        </>
    )
}

TestRef.test = {
    static: true,
    expect: () => {
        // The content should be updated immediately
        return '<p>Got ref - Has parent: true - Is connected: true</p>'
    }
}


export default () => <TestSnapshots Component={TestRef} />