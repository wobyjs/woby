import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestPromiseResolved = (): JSX.Element => {
    const resolved = usePromise<string>(new Promise(resolve => setTimeout(() => resolve('Loaded!'), TEST_INTERVAL)))
    return (
        <>
            <h3>Promise - Resolved</h3>
            {() => {
                if (resolved().pending) return <p>Pending...</p>
                if (resolved().error) return <p>{resolved().error!.message}</p>
                return <p>{resolved().value}</p>
            }}
        </>
    )
}

TestPromiseResolved.test = {
    static: false,
    expect: () => {
        // This component alternates between pending and resolved states
        const isResolved = Math.floor(Date.now() / TEST_INTERVAL) % 2 === 1
        return isResolved ? '<p>Loaded!</p>' : '<p>Pending...</p>'
    }
}


export default () => <TestSnapshots Component={TestPromiseResolved} />