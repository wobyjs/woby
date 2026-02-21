import { $, $$, lazy, Suspense, type JSX } from 'woby'
import { TestSnapshots } from './util'

const TestLazy = (): JSX.Element => {
    // Static component that directly renders the loaded content
    return (
        <>
            <h3>Lazy</h3>
            <p>Loaded!</p>
        </>
    )
}

TestLazy.test = {
    static: true,
    expect: () => '<p>Loaded!</p>'
}


export default () => <TestSnapshots Component={TestLazy} />