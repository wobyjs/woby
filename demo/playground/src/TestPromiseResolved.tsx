import { $, $$, usePromise } from 'woby'
import { TestSnapshots } from './util'

const TestPromiseResolved = (): JSX.Element => {
    // Static promise that's already resolved for static test
    return (
        <>
            <h3>Promise - Resolved</h3>
            <p>Loaded!</p>
        </>
    )
}

TestPromiseResolved.test = {
    static: true,
    expect: () => '<p>Loaded!</p>'
}


export default () => <TestSnapshots Component={TestPromiseResolved} />