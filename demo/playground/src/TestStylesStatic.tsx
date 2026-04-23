import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const name = 'TestStylesStatic'
const TestStylesStatic = (): JSX.Element => {
    const ret: JSX.Element = () => (
        <>
            <h3>Styles - Static</h3>
            <p style={{ color: 'green' }}>content</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}


// Conditional: SSR tests (Node.js environment - tsx mode)
if (typeof window === 'undefined') {
    TestStylesStatic()
    const ssrComponent = testObservables[`TestStylesStatic_ssr`]
    if (ssrComponent) {
        const ssrResult = renderToString(ssrComponent)
        console.log(`\n📝 Test: TestStylesStatic\n   SSR: ${ssrResult} ✅\n`)
    }
}

TestStylesStatic.test = {
    static: true,
    expect: () => {
        const expected = '<p style="color: green;">content</p>'

        // Test the SSR value
        const ssrComponent = testObservables[`${name}_ssr`]
        if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
            const ssrResult = renderToString(ssrComponent)
            const expectedFull = '<h3>Styles - Static</h3><p style="color: green;">content</p>'
            if (ssrResult !== expectedFull) {
                assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
            } else {
                console.log(`✅ [${name}] SSR test passed: ${ssrResult}`)
            }
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestStylesStatic} />