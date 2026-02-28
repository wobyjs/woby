import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestPropertyCheckedStatic = (): JSX.Element => {
    const ret: JSX.Element = (
        <>
            <h3>Property - Checked Static</h3>
            <p><input type="checkbox" checked={true} /></p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestPropertyCheckedStatic_ssr', ret)

    return ret
}

TestPropertyCheckedStatic.test = {
    static: true,
    expect: () => {
        // Define expected values for both main test and SSR test
        const expectedFull = '<h3>Property - Checked Static</h3><p><input type="checkbox"></p>'  // For SSR comparison (checked property does not render as attribute in SSR)
        const expected = '<p><input type="checkbox"></p>'   // For main DOM test comparison

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestPropertyCheckedStatic_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                // If it's a JSX element or function, we can render it to string
                // If it's a function, we need to call it first to get the element
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    if (ssrResult !== expectedFull) {
                        assert(false, `[TestPropertyCheckedStatic] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
                    } else {
                        console.log(`✅ [TestPropertyCheckedStatic] SSR test passed: ${ssrResult}`)
                    }
                }).catch(err => {
                    console.error(`[TestPropertyCheckedStatic] SSR render error: ${err}`)
                })
            }
        }, 0)

        return expected  // This is what the DOM test framework compares against
    }
}

export default () => <TestSnapshots Component={TestPropertyCheckedStatic} />