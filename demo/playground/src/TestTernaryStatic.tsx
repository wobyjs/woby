import { $, $$, Ternary, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const name = 'TestTernaryStatic'
const TestTernaryStatic = (): JSX.Element => {
    const ret: JSX.Element = () => (
        <>
            <h3>Ternary - Static</h3>
            <Ternary when={true}>
                <p>true (1)</p>
                <p>false (1)</p>
            </Ternary>
            <Ternary when={false}>
                <p>true (2)</p>
                <p>false (2)</p>
            </Ternary>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}


// Conditional: SSR tests (Node.js environment - tsx mode)
if (typeof window === 'undefined') {
    TestTernaryStatic()
    const ssrComponent = testObservables[`TestTernaryStatic_ssr`]
    if (ssrComponent) {
        const ssrResult = renderToString(ssrComponent)
        console.log(`\n📝 Test: TestTernaryStatic\n   SSR: ${ssrResult} ✅\n`)
    }
}

TestTernaryStatic.test = {
    static: true,
    expect: () => {
        const expected = '<p>true (1)</p><p>false (2)</p>'

        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<h3>Ternary - Static</h3><p>true (1)</p><p>false (2)</p>'
        if (ssrResult !== expectedFull) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestTernaryStatic} />