import { $, $$, createContext, useContext, renderToString, jsx } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestContextComponents = (): JSX.Element => {
    const Context = createContext('')
    const ret: JSX.Element = () => (
        <>
            <h3>Context - Components</h3>
            <Context.Provider value="outer">
                {() => {
                    const value = useContext(Context)
                    return <p>{value}</p>
                }}
                <Context.Provider value="inner">
                    {() => {
                        const value = useContext(Context)
                        return <p>{value}</p>
                    }}
                </Context.Provider>
                {() => {
                    const value = useContext(Context)
                    return <p>{value}</p>
                }}
            </Context.Provider>

            {/* Context.Provider with function children test */}
            <h3>Context.Provider(value, () =&gt; ) Test</h3>
            {() => jsx(Context.Provider, {
                value: "component-function-value",
                children: () => {
                    const ctxValue = useContext(Context)
                    return <p>Component function provider: {ctxValue}</p>
                }
            })}
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestContextComponents_ssr', ret)

    return ret
}

TestContextComponents.test = {
    static: true,
    expect: () => {
        // Define expected values for both main test and SSR test
        const expectedFull = '<h3>Context - Components</h3><context-provider value="outer" symbol="Symbol()"><p>outer</p><p>outer</p></context-provider><h3>Context.Provider(value, () => ) Test</h3><context-provider value="component-function-value" symbol="Symbol()"><p>Component function provider: component-function-value</p></context-provider>'  // For SSR comparison
        const expected = '<context-provider value="outer"><p>outer</p><context-provider value="inner"><p>inner</p></context-provider><p>outer</p></context-provider><h3>Context.Provider(value, () =&gt; ) Test</h3><context-provider value="component-function-value"><p>Component function provider: component-function-value</p></context-provider>'   // For main test comparison

        const ssrComponent = testObservables['TestContextComponents_ssr']
        const ssrResult = renderToString(ssrComponent)
        if (ssrResult !== expectedFull) {
            assert(false, `[TestContextComponents] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestContextComponents] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestContextComponents} />