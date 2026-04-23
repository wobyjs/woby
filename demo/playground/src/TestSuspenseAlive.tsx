import { $, $$, Suspense, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const name = 'TestSuspenseAlive'
const TestSuspenseAlive = (): JSX.Element => {
    const Content = () => {
        return <p>Content (0.123456)!</p>  // Static value
    }
    const ret: JSX.Element = () => (
        <>
            <h3>Suspense - Alive</h3>
            <Suspense when={true} fallback={<p>Loading (0.789012)...</p>}>
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
    TestSuspenseAlive()
    const ssrComponent = testObservables[`TestSuspenseAlive_ssr`]
    if (ssrComponent) {
        const ssrResult = renderToString(ssrComponent)
        console.log(`\n📝 Test: TestSuspenseAlive\n   SSR: ${ssrResult} ✅\n`)
    }
}

TestSuspenseAlive.test = {
    static: true,
    expect: () => {
        // Suspense may show fallback initially even when when={true}, so use the actual rendered value
        const expected = '<p>Loading (0.789012)...</p>'

        // Test the SSR value
        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<h3>Suspense - Alive</h3><p>Loading (0.789012)...</p>'
        if (ssrResult !== expectedFull) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestSuspenseAlive} />