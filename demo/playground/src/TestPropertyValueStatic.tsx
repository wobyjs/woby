import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const name = 'TestPropertyValueStatic'
const TestPropertyValueStatic = (): JSX.Element => {
    const ret: JSX.Element = () => (
        <>
            <h3>Property - Value Static</h3>
            <p><input value="value" /></p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}


// Conditional: SSR tests (Node.js environment - tsx mode)
if (typeof window === 'undefined') {
    TestPropertyValueStatic()
    const ssrComponent = testObservables[`TestPropertyValueStatic_ssr`]
    if (ssrComponent) {
        const ssrResult = renderToString(ssrComponent)
        console.log(`\n📝 Test: TestPropertyValueStatic\n   SSR: ${ssrResult} ✅\n`)
    }
}

TestPropertyValueStatic.test = {
    static: true,
    expect: () => {
        // Define expected values for both main test and SSR test
        const expectedFull = '<h3>Property - Value Static</h3><p><input value="value" /></p>'  // For SSR comparison
        const expected = '<p><input></p>'   // For main DOM test comparison

        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        if (ssrResult !== expectedFull) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [${name}] SSR test passed: ${ssrResult}`)
        }

        return expected  // This is what the DOM test framework compares against
    }
}

export default () => <TestSnapshots Component={TestPropertyValueStatic} />
