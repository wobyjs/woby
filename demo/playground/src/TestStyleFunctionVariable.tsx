import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const name = 'TestStyleFunctionVariable'
const TestStyleFunctionVariable = (): JSX.Element => {
    const o = $('green')
    registerTestObservable('TestStyleFunctionVariable', o)
    const toggle = () => o(prev => (prev === 'orange') ? 'green' : 'orange')
    useInterval(toggle, TEST_INTERVAL)
    const ret: JSX.Element = () => (
        <>
            <h3>Style - Function Variable</h3>
            <p style={{ color: 'var(--color)', '--color': () => o() }}>content</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}


// Conditional: SSR tests (Node.js environment - tsx mode)
if (typeof window === 'undefined') {
    TestStyleFunctionVariable()
    const ssrComponent = testObservables[`TestStyleFunctionVariable_ssr`]
    if (ssrComponent) {
        const ssrResult = renderToString(ssrComponent)
        console.log(`\n📝 Test: TestStyleFunctionVariable\n   SSR: ${ssrResult} ✅\n`)
    }
}

TestStyleFunctionVariable.test = {
    static: false,
    expect: () => {
        const value = $$(testObservables[name])
        const expected = `<p style="color: var(--color); --color: ${value};">content</p>`

        // Test the SSR value
        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = `<h3>Style - Function Variable</h3><p style="color: var(--color); --color: ${value};">content</p>`
        if (ssrResult !== expectedFull) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestStyleFunctionVariable} />