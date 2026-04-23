import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const name = 'TestIdFunction'
const TestIdFunction = (): JSX.Element => {
    const o = $('foo')
    registerTestObservable('TestIdFunction', o)
    const toggle = () => o(prev => (prev === 'foo') ? 'bar' : 'foo')
    useInterval(toggle, TEST_INTERVAL)
    const ret: JSX.Element = () => (
        <>
            <h3>ID - Function</h3>
            <p id={() => o()}>content</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}


// Conditional: SSR tests (Node.js environment - tsx mode)
if (typeof window === 'undefined') {
    TestIdFunction()
    const ssrComponent = testObservables[`TestIdFunction_ssr`]
    if (ssrComponent) {
        const ssrResult = renderToString(ssrComponent)
        console.log(`\n📝 Test: TestIdFunction\n   SSR: ${ssrResult} ✅\n`)
    }
}

TestIdFunction.test = {
    static: false,
    expect: () => {
        const value = $$(testObservables[name])
        const expected = `<p id="${value}">content</p>`

        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = `<h3>ID - Function</h3><p id="${value}">content</p>`
        if (ssrResult !== expectedFull) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestIdFunction} />