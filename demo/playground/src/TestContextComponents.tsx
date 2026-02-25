import { $, $$, createContext, useContext, renderToString, jsx } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestContextComponents = (): JSX.Element => {
    const Context = createContext('')
    const ret: JSX.Element = (
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
        const expectedFull = '<h3>Context - Components</h3><p>outer</p><p>inner</p><p>outer</p><h3>Context.Provider(value, () =&gt; ) Test</h3><p>Component function provider: component-function-value</p>'  // For SSR comparison
        const expected = '<p>outer</p><p>inner</p><p>outer</p><h3>Context.Provider(value, () =&gt; ) Test</h3><p>Component function provider: component-function-value</p>'   // For main test comparison

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestContextComponents_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                // If it's a JSX element or function, we can render it to string
                // If it's a function, we need to call it first to get the element
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    if (ssrResult !== expectedFull) {
                        assert(false, `[TestContextComponents] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
                    } else {
                        console.log(`✅ [TestContextComponents] SSR test passed: ${ssrResult}`)
                    }
                }).catch(err => {
                    console.error(`[TestContextComponents] SSR render error: ${err}`)
                })
            }
        }, 0)

        return expected
    }
}


export default () => <TestSnapshots Component={TestContextComponents} />