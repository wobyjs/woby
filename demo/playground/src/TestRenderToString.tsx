import { $, $$, renderToString } from 'woby'
import { TestSnapshots, registerTestObservable, testObservables, assert } from './util'

const TestRenderToString = (): JSX.Element => {
    // Static component that returns the expected structure
    const ret: JSX.Element = () => (
        <div>
            <h3>renderToString</h3>
            <p>123</p>
        </div>
    )

    // Store the component for SSR testing
    registerTestObservable('TestRenderToString_ssr', ret)

    return ret
}

TestRenderToString.test = {
    static: true,
    expect: () => {
        const expected = '<div><p>123</p></div>'

        const ssrComponent = testObservables['TestRenderToString_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<div><h3>renderToString</h3><p>123</p></div>'
        if (ssrResult !== expectedFull) {
            assert(false, `[TestRenderToString] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestRenderToString] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestRenderToString} />