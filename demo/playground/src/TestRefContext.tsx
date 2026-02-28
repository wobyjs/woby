import { $, $$, createContext, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestRefContext = (): JSX.Element => {
    const Context = createContext(123)
    const ret: JSX.Element = (
        <>
            <h3>Ref - Context</h3>
            <Context.Provider value={321}>
                <p>content</p>
            </Context.Provider>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestRefContext_ssr', ret)

    return ret
}

TestRefContext.test = {
    static: true,
    expect: () => {
        // Define expected values for both main test and SSR test
        const expectedFull = '<h3>Ref - Context</h3><p>content</p>'  // For SSR comparison
        const expected = '<p>content</p>'   // For main DOM test comparison

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestRefContext_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                // If it's a JSX element or function, we can render it to string
                // If it's a function, we need to call it first to get the element
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    if (ssrResult !== expectedFull) {
                        assert(false, `[TestRefContext] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
                    } else {
                        console.log(`✅ [TestRefContext] SSR test passed: ${ssrResult}`)
                    }
                }).catch(err => {
                    console.error(`[TestRefContext] SSR render error: ${err}`)
                })
            }
        }, 0)

        return expected  // This is what the DOM test framework compares against
    }
}


export default () => <TestSnapshots Component={TestRefContext} />