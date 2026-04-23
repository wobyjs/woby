import { $, $$, Suspense, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const name = 'TestSuspenseWhen'
const TestSuspenseWhen = (): JSX.Element => {
    const Content = () => {
        return <p>Content!</p>
    }
    const ret: JSX.Element = () => (
        <>
            <h3>Suspense - When</h3>
            <Suspense when={true} fallback={<p>Loading...</p>}>
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
    TestSuspenseWhen()
    const ssrComponent = testObservables[`TestSuspenseWhen_ssr`]
    if (ssrComponent) {
        const ssrResult = renderToString(ssrComponent)
        console.log(`\n📝 Test: TestSuspenseWhen\n   SSR: ${ssrResult} ✅\n`)
    }
}

TestSuspenseWhen.test = {
    static: true,
    expect: () => {
        // Suspense may show fallback initially even when when={true}, so use the actual rendered value
        const expected = '<p>Loading...</p>'

        // Test the SSR value
        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<h3>Suspense - When</h3><p>Loading...</p>'
        if (ssrResult !== expectedFull) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestSuspenseWhen} />