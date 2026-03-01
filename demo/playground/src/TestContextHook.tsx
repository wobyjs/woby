import { $, $$, createContext, useContext, renderToString, jsx } from 'woby'
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
        const expectedFull = '<h3>Context - Hook</h3><p>outer</p><p>inner</p><p>outer</p><h3>Context.Provider(value, () =&gt; ) Test</h3><p>Function provider: function-value</p>'  // For SSR comparison
        const expected = '<p>outer</p><p>inner</p><p>outer</p><h3>Context.Provider(value, () =&gt; ) Test</h3><p>Function provider: function-value</p>'   // For main test comparison

        const ssrComponent = testObservables['TestContextHook_ssr']
        const ssrResult = renderToString(ssrComponent)
        if (ssrResult !== expectedFull) {
            assert(false, `[TestContextHook] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestContextHook] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestContextHook} />