import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

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
    registerTestObservable('TestStyleFunctionVariable_ssr', ret)

    return ret
}

TestStyleFunctionVariable.test = {
    static: false,
    expect: () => {
        const value = $$(testObservables['TestStyleFunctionVariable'])
        const expected = `<p style="color: var(--color); --color: ${value};">content</p>`

        // Test the SSR value
        const ssrComponent = testObservables['TestStyleFunctionVariable_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = `<h3>Style - Function Variable</h3><p style="color: var(--color); --color: ${value};">content</p>`
        if (ssrResult !== expectedFull) {
            assert(false, `[TestStyleFunctionVariable] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [TestStyleFunctionVariable] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestStyleFunctionVariable} />