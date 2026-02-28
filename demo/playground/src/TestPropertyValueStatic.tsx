import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestPropertyValueStatic = (): JSX.Element => {
    const ret: JSX.Element = (
        <>
            <h3>Property - Value Static</h3>
            <p><input value="value" /></p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestPropertyValueStatic_ssr', ret)

    return ret
}

TestPropertyValueStatic.test = {
    static: true,
    expect: () => {
        // Define expected values for both main test and SSR test
        const expectedFull = '<h3>Property - Value Static</h3><p><input></p>'  // For SSR comparison (value property does not render as attribute in SSR)
        const expected = '<p><input></p>'   // For main DOM test comparison

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestPropertyValueStatic_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                // If it's a JSX element or function, we can render it to string
                // If it's a function, we need to call it first to get the element
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    if (ssrResult !== expectedFull) {
                        assert(false, `[TestPropertyValueStatic] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
                    } else {
                        console.log(`✅ [TestPropertyValueStatic] SSR test passed: ${ssrResult}`)
                    }
                }).catch(err => {
                    console.error(`[TestPropertyValueStatic] SSR render error: ${err}`)
                })
            }
        }, 0)

        return expected  // This is what the DOM test framework compares against
    }
}

export default () => <TestSnapshots Component={TestPropertyValueStatic} />