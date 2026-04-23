import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const name = 'TestChildrenBoolean'
const TestChildrenBoolean = (): JSX.Element => {
    const Custom = ({ children }) => {
        return <p>{Number(children)}</p>
    }
    const ret: JSX.Element = () => (
        <>
            <h3>Children - Boolean</h3>
            <Custom>{true}</Custom>
            <Custom>{false}</Custom>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}

// Conditional: SSR tests (Node.js environment - tsx mode)
if (typeof window === 'undefined') {
    TestChildrenBoolean() // Register the component
    const ssrComponent = testObservables[`${name}_ssr`]
    const ssrResult = renderToString(ssrComponent)
    const expectedFull = '<h3>Children - Boolean</h3><p>1</p><p>0</p>'
    const passed = ssrResult === expectedFull
    console.log(`\n📝 Test: ${name}\n   SSR: ${ssrResult} ${passed ? '✅' : '❌'}\n`)
    if (!passed) { console.error(`❌ [${name}] failed`); process.exit(1) }
}

TestChildrenBoolean.test = {
    static: true,
    expect: () => {
        const expected = '<p>1</p><p>0</p>'

        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<h3>Children - Boolean</h3><p>1</p><p>0</p>'
        if (ssrResult !== expectedFull) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestChildrenBoolean} />