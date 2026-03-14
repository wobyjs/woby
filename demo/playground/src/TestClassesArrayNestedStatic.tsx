import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const name = 'TestClassesArrayNestedStatic'
const TestClassesArrayNestedStatic = (): JSX.Element => {
    const o = $(['red', ['bold', { 'italic': true }]])
    const ret: JSX.Element = () => (
        <>
            <h3>Classes - Array Nested Static</h3>
            <p class={o}>content</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestClassesArrayNestedStatic_ssr', ret)

    return ret
}

TestClassesArrayNestedStatic.test = {
    static: true,
    expect: () => {
        // Define expected values for both main test and SSR test
        const expectedFull = '<h3>Classes - Array Nested Static</h3><p class="red bold italic">content</p>'  // For SSR comparison
        const expected = '<p class="red bold italic">content</p>'   // For main test comparison

        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        if (ssrResult !== expectedFull) {
            assert(false, `${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ ${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestClassesArrayNestedStatic} />