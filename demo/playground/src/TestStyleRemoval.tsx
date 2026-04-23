import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const name = 'TestStyleRemoval'
const TestStyleRemoval = (): JSX.Element => {
    const o = $<string | null>('green')
    registerTestObservable('TestStyleRemoval', o)
    const toggle = () => o(prev => prev ? null : 'green')
    useInterval(toggle, TEST_INTERVAL)
    const ret: JSX.Element = () => (
        <>
            <h3>Style - Removal</h3>
            <p style={{ color: o }}>content</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}


// Conditional: SSR tests (Node.js environment - tsx mode)
if (typeof window === 'undefined') {
    TestStyleRemoval()
    const ssrComponent = testObservables[`TestStyleRemoval_ssr`]
    if (ssrComponent) {
        const ssrResult = renderToString(ssrComponent)
        console.log(`\n📝 Test: TestStyleRemoval\n   SSR: ${ssrResult} ✅\n`)
    }
}

TestStyleRemoval.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const value = $$(testObservables[name])
        const expected = value ? `<p style="color: ${value};">content</p>` : '<p style="">content</p>'

        // Test the SSR value
        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = value ?
            `<h3>Style - Removal</h3><p style="color: ${value};">content</p>` :
            '<h3>Style - Removal</h3><p>content</p>'
        if (ssrResult !== expectedFull) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestStyleRemoval} />