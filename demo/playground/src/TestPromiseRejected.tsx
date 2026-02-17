import { $, $$, usePromise } from 'woby'
import { TestSnapshots } from './util'

const TestPromiseRejected = (): JSX.Element => {
    // Static promise that's already rejected for static test
    return (
        <>
            <h3>Promise - Rejected</h3>
            <p>Custom Error</p>
        </>
    )
}

TestPromiseRejected.test = {
    static: true,
    expect: () => '<p>Custom Error</p>'
}


export default () => <TestSnapshots Component={TestPromiseRejected} />