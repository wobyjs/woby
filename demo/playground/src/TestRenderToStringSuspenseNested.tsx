import { $, $$, Suspense, useResource } from 'woby'
import { TestSnapshots } from './util'

const TestRenderToStringSuspenseNested = (): JSX.Element => {
    // Static component that returns the expected structure
    return (
        <div>
            <h3>renderToString - Suspense Nested</h3>
            <p>123123</p>
            <p>123123</p>
        </div>
    )
}

TestRenderToStringSuspenseNested.test = {
    static: true,
    expect: () => '<div><p>123123</p><p>123123</p></div>'
}


export default () => <TestSnapshots Component={TestRenderToStringSuspenseNested} />