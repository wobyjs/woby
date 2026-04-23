import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const name = 'TestStylesCleanup'
const TestStylesCleanup = (): JSX.Element => {
    const styles = { color: 'orange', fontWeight: 'bold' }  // Static value
    const ret: JSX.Element = () => (
        <>
            <h3>Styles - Observable Cleanup</h3>
            <p style={styles}>content</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}


// Conditional: SSR tests (Node.js environment - tsx mode)
if (typeof window === 'undefined') {
    TestStylesCleanup()
    const ssrComponent = testObservables[`TestStylesCleanup_ssr`]
    if (ssrComponent) {
        const ssrResult = renderToString(ssrComponent)
        console.log(`\n📝 Test: TestStylesCleanup\n   SSR: ${ssrResult} ✅\n`)
    }
}

TestStylesCleanup.test = {
    static: true,
    expect: () => {
        const expected = '<p style="color: orange; font-weight: bold;">content</p>'

        // Test the SSR value
        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<h3>Styles - Observable Cleanup</h3><p style="color: orange; font-weight: bold;">content</p>'
        if (ssrResult !== expectedFull) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestStylesCleanup} />