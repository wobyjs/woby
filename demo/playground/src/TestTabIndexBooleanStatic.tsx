import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const name = 'TestTabIndexBooleanStatic'
const TestTabIndexBooleanStatic = (): JSX.Element => {
    const ret: JSX.Element = () => (
        <>
            <h3>TabIndex - Boolean - Static</h3>
            <p tabIndex={true}>true</p>
            <p tabIndex={false}>false</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}


// Conditional: SSR tests (Node.js environment - tsx mode)
if (typeof window === 'undefined') {
    TestTabIndexBooleanStatic()
    const ssrComponent = testObservables[`TestTabIndexBooleanStatic_ssr`]
    if (ssrComponent) {
        const ssrResult = renderToString(ssrComponent)
        console.log(`\n📝 Test: TestTabIndexBooleanStatic\n   SSR: ${ssrResult} ✅\n`)
    }
}

TestTabIndexBooleanStatic.test = {
    static: true,
    expect: () => {
        const expected = '<p tabindex="0">true</p><p>false</p>'

        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<h3>TabIndex - Boolean - Static</h3><p tabindex="0">true</p><p>false</p>'
        if (ssrResult !== expectedFull) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestTabIndexBooleanStatic} />
