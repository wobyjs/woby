import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, registerTestObservable, testObservables, assert } from './util'

const name = 'TestRenderToString'
const TestRenderToString = (): JSX.Element => {
    // Static component that returns the expected structure
    const ret: JSX.Element = () => (
        <div>
            <h3>renderToString</h3>
            <p>123</p>
        </div>
    )

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}


// Conditional: SSR tests (Node.js environment - tsx mode)
if (typeof window === 'undefined') {
    TestRenderToString()
    const ssrComponent = testObservables[`TestRenderToString_ssr`]
    if (ssrComponent) {
        const ssrResult = renderToString(ssrComponent)
        console.log(`\n📝 Test: TestRenderToString\n   SSR: ${ssrResult} ✅\n`)
    }
}

TestRenderToString.test = {
    static: true,
    expect: () => {
        const expected = '<div><p>123</p></div>'

        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<div><h3>renderToString</h3><p>123</p></div>'
        if (ssrResult !== expectedFull) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestRenderToString} />