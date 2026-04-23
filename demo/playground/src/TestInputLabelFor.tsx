import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, random, registerTestObservable, testObservables, assert } from './util'

const name = 'TestInputLabelFor'
const TestInputLabelFor = (): JSX.Element => {
    const ret: JSX.Element = () => (
        <>
            <h3>Input - Label For</h3>
            <p><label htmlFor="for-target">htmlFor</label></p>
            <p><label for="for-target">for</label></p>
            <p><input id="for-target" /></p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}


// Conditional: SSR tests (Node.js environment - tsx mode)
if (typeof window === 'undefined') {
    TestInputLabelFor()
    const ssrComponent = testObservables[`TestInputLabelFor_ssr`]
    if (ssrComponent) {
        const ssrResult = renderToString(ssrComponent)
        console.log(`\n📝 Test: TestInputLabelFor\n   SSR: ${ssrResult} ✅\n`)
    }
}

TestInputLabelFor.test = {
    static: true,
    expect: () => {
        // Define expected values for both main test and SSR test
        // Note: htmlFor attribute is kept as-is in SSR (not converted to for)
        const expectedFull = '<h3>Input - Label For</h3><p><label htmlfor="for-target">htmlFor</label></p><p><label for="for-target">for</label></p><p><input id="for-target" /></p>'
        const expected = '<p><label for="for-target">htmlFor</label></p><p><label for="for-target">for</label></p><p><input id="for-target"></p>'   // For main DOM test comparison
        // Test the SSR value synchronously
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

export default () => <TestSnapshots Component={TestInputLabelFor} />