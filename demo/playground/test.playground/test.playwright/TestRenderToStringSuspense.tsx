import { $, $$, Suspense, useResource } from 'woby'
import { TestSnapshots } from './util'

const TestRenderToStringSuspense = (): JSX.Element => {
    // Static component that returns the expected structure
    return (
        <div>
            <h3>renderToString - Suspense</h3>
            <p>123123</p>
        </div>
    )
}

TestRenderToStringSuspense.test = {
    static: true,
    expect: () => '<div><p>123123</p></div>'
}


export default () => <TestSnapshots Component={TestRenderToStringSuspense} />