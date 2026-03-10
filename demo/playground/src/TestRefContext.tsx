import { $, $$, createContext, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestRefContext = (): JSX.Element => {
    const Context = createContext(123)
    const ret: JSX.Element = () => (
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
    static: false,
    expect: () => {
        // Define expected values for both main test and SSR test
        // Note: SSR doesn't render symbol attributes
        const expectedFull = '<h3>Ref - Context</h3><context-provider value="321"><p>content</p></context-provider>'  // For SSR comparison
        const expected = '<context-provider value="321"><p>content</p></context-provider>'   // For main DOM test comparison

        const ssrComponent = testObservables['TestRefContext_ssr']
        const ssrResult = renderToString(ssrComponent)
        if (ssrResult !== expectedFull) {
            assert(false, `[TestRefContext] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [TestRefContext] SSR test passed: ${ssrResult}`)
        }

        return expected  // This is what the DOM test framework compares against
    }
}


export default () => <TestSnapshots Component={TestRefContext} />