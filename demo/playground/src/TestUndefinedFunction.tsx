import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const name = 'TestUndefinedFunction'
const TestUndefinedFunction = (): JSX.Element => {
    const o = $<string>(undefined)
    // Store the observable globally so the test can access it
    registerTestObservable('TestUndefinedFunction', o)
    const toggle = () => o(prev => (prev === undefined) ? '' : undefined)
    useInterval(toggle, TEST_INTERVAL)
    const ret: JSX.Element = () => (
        <>
            <h3>Undefined - Function</h3>
            <p>{() => o()}</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}


// Conditional: SSR tests (Node.js environment - tsx mode)
if (typeof window === 'undefined') {
    TestUndefinedFunction()
    const ssrComponent = testObservables[`TestUndefinedFunction_ssr`]
    if (ssrComponent) {
        const ssrResult = renderToString(ssrComponent)
        console.log(`\n📝 Test: TestUndefinedFunction\n   SSR: ${ssrResult} ✅\n`)
    }
}

TestUndefinedFunction.test = {
    static: false,
    expect: () => {
        const value = $$(testObservables[name])
        const expectedForDOM = value !== undefined ? `<p>${value}</p>` : '<p><!----></p>'
        const expectedForSSR = value !== undefined ? `<p>${value}</p>` : '<p></p>'

        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        const expectedFullForSSR = value !== undefined ? `<h3>Undefined - Function</h3><p>${value}</p>` : '<h3>Undefined - Function</h3><p></p>'
        if (ssrResult !== expectedFullForSSR) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFullForSSR}`)
        } else {
            console.log(`✅ [${name}] SSR test passed: ${ssrResult}`)
        }

        return expectedForDOM
    }
}


export default () => <TestSnapshots Component={TestUndefinedFunction} />