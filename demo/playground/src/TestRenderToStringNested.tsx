import { $, $$, Suspense, useResource } from 'woby'
import { TestSnapshots } from './util'

const TestRenderToStringNested = (): JSX.Element => {
    // Static component that returns the expected structure
    return (
        <div>
            <h3>renderToString - Nested</h3>
            <p>123&lt;div&gt;&lt;h3&gt;renderToString&lt;/h3&gt;&lt;p&gt;123&lt;/p&gt;&lt;/div&gt;</p>
        </div>
    )
}

TestRenderToStringNested.test = {
    static: true,
    expect: () => '<div><p>123&lt;div&gt;&lt;h3&gt;renderToString&lt;/h3&gt;&lt;p&gt;123&lt;/p&gt;&lt;/div&gt;</p></div>'
}

export default () => <TestSnapshots Component={TestRenderToStringNested} />