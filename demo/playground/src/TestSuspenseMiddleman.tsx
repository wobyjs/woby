import { $, $$, Suspense, useResource, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const name = 'TestSuspenseMiddleman'
const TestSuspenseMiddleman = (): JSX.Element => {
    const Content = () => {
        return <p>Middleman!</p>  // Static content
    }
    const ret: JSX.Element = () => (
        <>
            <h3>Suspense - Middleman</h3>
            <Suspense fallback={<p>Loading...</p>}>
                <Content />
            </Suspense>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}


// Conditional: SSR tests (Node.js environment - tsx mode)
if (typeof window === 'undefined') {
    TestSuspenseMiddleman()
    const ssrComponent = testObservables[`TestSuspenseMiddleman_ssr`]
    if (ssrComponent) {
        const ssrResult = renderToString(ssrComponent)
        console.log(`\n📝 Test: TestSuspenseMiddleman\n   SSR: ${ssrResult} ✅\n`)
    }
}

TestSuspenseMiddleman.test = {
    static: true,
    expect: () => {
        const expected = '<p>Middleman!</p>'

        // Test the SSR value
        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<h3>Suspense - Middleman</h3><p>Middleman!</p>'
        if (ssrResult !== expectedFull) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestSuspenseMiddleman} />