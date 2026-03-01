import { $, $$, createContext, useContext, Dynamic, renderToString, jsx } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestContextDynamicContext = () => {

    const Context = createContext('default')

    const DynamicFragment = props => {
        const ctx = useContext(Context)
        return (
            <>
                <p>{ctx}</p>
                <p>{props.children}</p>
                <Dynamic component="p">{props.children}</Dynamic>
                <Dynamic component="p" children={props.children} />
            </>
        )
    }

    const ret: JSX.Element = () => (
        <>
            <h3>Dynamic - Context</h3>
            <Context.Provider value="context">
                <DynamicFragment>
                    <DynamicFragment />
                </DynamicFragment>
            </Context.Provider>

            {/* Context.Provider with function children test */}
            <h3>Context.Provider(value, () =&gt; ) Test</h3>
            {() => jsx(Context.Provider, {
                value: "dynamic-function-value",
                children: () => {
                    const ctxValue = useContext(Context)
                    return (
                        <>
                            <p>Dynamic function provider: {ctxValue}</p>
                            <p>Dynamic content: {ctxValue}</p>
                        </>
                    )
                }
            })}
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestContextDynamicContext_ssr', ret)

    return ret

}

TestContextDynamicContext.test = {
    static: true,
    expect: () => {
        // Define expected values for both main test and SSR test
        const expectedFull = '<h3>Dynamic - Context</h3><p>context</p><p><p>context</p><p></p><p></p><p></p></p><p><p>context</p><p></p><p></p><p></p></p><p><p>context</p><p></p><p></p><p></p></p><h3>Context.Provider(value, () =&gt; ) Test</h3><p>Dynamic function provider: dynamic-function-value</p><p>Dynamic content: dynamic-function-value</p>'  // For SSR comparison
        const expected = '<p>context</p><p><p>context</p><p></p><p></p><p></p></p><p><p>context</p><p></p><p></p><p></p></p><p><p>context</p><p></p><p></p><p></p></p><h3>Context.Provider(value, () =&gt; ) Test</h3><p>Dynamic function provider: dynamic-function-value</p><p>Dynamic content: dynamic-function-value</p>'   // For main test comparison

        const ssrComponent = testObservables['TestContextDynamicContext_ssr']
        const ssrResult = renderToString(ssrComponent)
        if (ssrResult !== expectedFull) {
            assert(false, `[TestContextDynamicContext] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestContextDynamicContext] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestContextDynamicContext} />