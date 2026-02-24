import { $, $$, renderToString } from 'woby'
import { TestSnapshots, random, registerTestObservable, testObservables, assert } from './util'

const TestInputLabelFor = (): JSX.Element => {
    const ret: JSX.Element = (
        <>
            <h3>Input - Label For</h3>
            <p><label htmlFor="for-target">htmlFor</label></p>
            <p><label for="for-target">for</label></p>
            <p><input id="for-target" /></p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestInputLabelFor_ssr', ret)

    return ret
}

TestInputLabelFor.test = {
    static: true,
    expect: () => {
        // Define expected values for both main test and SSR test
        const expectedFull = '<h3>Input - Label For</h3><p><label for="for-target">htmlFor</label></p><p><label for="for-target">for</label></p><p><input id="for-target"></p>'  // For SSR comparison
        const expected = '<p><label for="for-target">htmlFor</label></p><p><label for="for-target">for</label></p><p><input id="for-target"></p>'   // For main DOM test comparison

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestInputLabelFor_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                // If it's a JSX element or function, we can render it to string
                // If it's a function, we need to call it first to get the element
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    if (ssrResult !== expectedFull) {
                        assert(false, `SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
                    } else {
                        console.log(`✅ SSR test passed: ${ssrResult}`)
                    }
                }).catch(err => {
                    console.error(`SSR render error: ${err}`)
                })
            }
        }, 0)

        return expected  // This is what the DOM test framework compares against
    }
}

export default () => <TestSnapshots Component={TestInputLabelFor} />