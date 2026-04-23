import { $, Suspense, useResource, renderToString, type JSX } from 'woby'
import { TestSnapshots, registerTestObservable, testObservables, assert } from './util'

const TEST_INTERVAL = 500

const name = 'TestRenderToStringSuspense'
const TestRenderToStringSuspense = (): JSX.Element => {
    const o = $(123)
    const Content = () => {
        return <p>{o}{o()}</p>
    }
    const ret: JSX.Element = () => (
        <div>
            <h3>renderToString - Suspense</h3>
            <Suspense>
                <Content />
            </Suspense>
        </div>
    )

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}


// Conditional: SSR tests (Node.js environment - tsx mode)
if (typeof window === 'undefined') {
    TestRenderToStringSuspense()
    const ssrComponent = testObservables[`TestRenderToStringSuspense_ssr`]
    if (ssrComponent) {
        const ssrResult = renderToString(ssrComponent)
        console.log(`\n📝 Test: TestRenderToStringSuspense\n   SSR: ${ssrResult} ✅\n`)
    }
}

TestRenderToStringSuspense.test = {
    static: true,
    expect: () => {
        const expected = '<div><p>123123</p></div>'

        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<div><h3>renderToString - Suspense</h3><p>123123</p></div>'
        if (ssrResult !== expectedFull) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}

export default () => <TestSnapshots Component={TestRenderToStringSuspense} />