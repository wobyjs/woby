import { $, $$, If, renderToString, type JSX } from 'woby'
import { TestSnapshots, registerTestObservable, testObservables, assert } from './util'

const name = 'TestIfFunction'
const TestIfFunction = (): JSX.Element => {
    // Static value for static test
    const ret: JSX.Element = () => (
        <>
            <h3>If - Function</h3>
            <p>(<If when={true}>content</If>)</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}


// Conditional: SSR tests (Node.js environment - tsx mode)
if (typeof window === 'undefined') {
    TestIfFunction()
    const ssrComponent = testObservables[`TestIfFunction_ssr`]
    if (ssrComponent) {
        const ssrResult = renderToString(ssrComponent)
        console.log(`\n📝 Test: TestIfFunction\n   SSR: ${ssrResult} ✅\n`)
    }
}

TestIfFunction.test = {
    static: true,
    expect: () => {
        // Define expected values for both main test and SSR test
        const expectedFull = '<h3>If - Function</h3><p>(content)</p>'
        const expected = '<p>(content)</p>'

        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        if (ssrResult !== expectedFull) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestIfFunction} />