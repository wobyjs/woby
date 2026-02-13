import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestPromiseRejected = (): JSX.Element => {
    const rejected = usePromise<number>(new Promise((_, reject) => setTimeout(() => reject('Custom Error'), TEST_INTERVAL)))
    return (
        <>
            <h3>Promise - Rejected</h3>
            {() => {
                if (rejected().pending) return <p>Pending...</p>
                if (rejected().error) return <p>{rejected().error!.message}</p>
                return <p>{rejected().value}</p>
            }}
        </>
    )
}

TestPromiseRejected.test = {
    static: false,
    expect: () => {
        // This component alternates between pending and rejected states
        const isRejected = Math.floor(Date.now() / TEST_INTERVAL) % 2 === 1
        return isRejected ? '<p>Custom Error</p>' : '<p>Pending...</p>'
    }
}


export default () => <TestSnapshots Component={TestPromiseRejected} />