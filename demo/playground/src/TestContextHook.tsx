import { $, $$, createContext, useContext, renderToString, jsx, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestContextHook = (): JSX.Element => {
    const Context = createContext('')
    const Reader = (): JSX.Element => {
        const value = useContext(Context)
        return <p>{value}</p>
    }
    const ret: JSX.Element = () => (
        <>
            <h3>Context - Hook</h3>
            <Context.Provider value="outer">
                <Reader />
                <Context.Provider value="inner">
                    <Reader />
                </Context.Provider>
                <Reader />
            </Context.Provider>

            {/* Context.Provider with function children test */}
            <h3>Context.Provider(value, () =&gt; ) Test</h3>
            {() => jsx(Context.Provider, {
                value: "function-value",
                children: () => {
                    const value = useContext(Context)
                    return <p>Function provider: {value}</p>
                }
            })
            }
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestContextHook_ssr', ret)

    return ret
}

TestContextHook.test = {
    static: true,
    expect: () => {
        // Define expected values for both main test and SSR test
        // Note: SSR doesn't render symbol attributes
        const expectedFull = '<h3>Context - Hook</h3><context-provider value="outer"><p>outer</p><context-provider value="inner"><p>inner</p></context-provider><p>outer</p></context-provider><h3>Context.Provider(value, () => ) Test</h3><context-provider value="function-value"><p>Function provider: function-value</p></context-provider>'  // For SSR comparison
        const expected = '<context-provider value="outer"><p>outer</p><context-provider value="inner"><p>inner</p></context-provider><p>outer</p></context-provider><h3>Context.Provider(value, () =&gt; ) Test</h3><context-provider value="function-value"><p>Function provider: function-value</p></context-provider>'   // For main test comparison

        const ssrComponent = testObservables['TestContextHook_ssr']
        const ssrResult = renderToString(ssrComponent)
        if (ssrResult !== expectedFull) {
            assert(false, `[TestContextHook] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [TestContextHook] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestContextHook} />