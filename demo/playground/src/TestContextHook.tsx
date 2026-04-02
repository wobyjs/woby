import { $, $$, createContext, useContext, renderToString, jsx, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert, minimiseHtml } from './util'

const name = 'TestContextHook'
const TestContextHook = (): JSX.Element => {
    const Context = createContext('')

    const Reader = (): JSX.Element => {
        const value = useContext(Context)
        return <p data-test="reader">{value}</p>
    }

    // Helper components for different positions
    const NestedFnLastChild = () => {
        const value = useContext(Context)
        return <p data-test="nested-fn-last">{value}</p>
    }

    const FnProviderChild = () => {
        const value = useContext(Context)
        return <p data-test="fn-provider">Function provider: {value}</p>
    }

    const Position1 = () => <p data-test="pos-1">Before: {useContext(Context)}</p>
    const Position2Nested = () => <p data-test="pos-2-nested">Nested Before: {useContext(Context)}</p>
    const Position3 = () => <p data-test="pos-3">Middle: {useContext(Context)}</p>
    const Position4 = () => {
        const value = useContext(Context)
        return <p data-test="pos-4">Override: {value}</p>
    }
    const Position5 = () => <p data-test="pos-5">After: {useContext(Context)}</p>

    // Test isStatic behavior - value should be unwrapped with $$()
    const IsStaticTestChild = () => {
        const value = useContext(Context)
        const valueType = typeof value
        return (
            <div data-test="isstatic-test">
                <p data-test="isstatic-value">Value: {value}</p>
                <p data-test="isstatic-type">Type: {valueType}</p>
                <p data-test="isstatic-not-function">Is not function: {String(valueType !== 'function')}</p>
            </div>
        )
    }

    const ret: JSX.Element = () => (
        <>
            <h3>Context - Hook</h3>
            <Context.Provider value="outer">
                {/* First child */}
                <Reader />

                {/* Middle content - nested provider with children at different positions */}
                <Context.Provider value="inner">
                    {/* First child in nested */}
                    <Reader />

                    {/* Middle child */}
                    <div data-test="middle-content">
                        <span>nested element</span>
                    </div>

                    {/* Last child in nested */}
                    <NestedFnLastChild />
                </Context.Provider>

                {/* Last child */}
                <Reader />

                {/* Additional sibling after nested provider */}
                <span data-test="separator">-</span>
            </Context.Provider>

            {/* Context.Provider with function children test */}
            <h3>Context.Provider(value, () =&gt; ) Test</h3>
            {() => jsx(Context.Provider, {
                value: "function-value",
                children: FnProviderChild
            })
            }

            {/* Test: Children before and after provider content */}
            <h3>Position Independence Test</h3>
            <Context.Provider value="position-test">
                <Position1 />
                <div data-test="pos-2">
                    <Position2Nested />
                </div>
                <Position3 />
                <Context.Provider value="override-position">
                    <Position4 />
                </Context.Provider>
                <Position5 />
            </Context.Provider>

            {/* Test isStatic prop - ensures observable values are unwrapped */}
            <h3>isStatic Test</h3>
            <Context.Provider value={$('observable-value')} isStatic={true}>
                <IsStaticTestChild />
            </Context.Provider>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}

TestContextHook.test = {
    static: true,
    expect: () => {
        // Define expected values for both main test and SSR test
        // Note: SSR doesn't render symbol attributes
        const expectedFull = '<h3>Context - Hook</h3><context-provider value="outer"><p data-test="reader">outer</p><context-provider value="inner"><p data-test="reader">inner</p><div data-test="middle-content"><span>nested element</span></div><p data-test="nested-fn-last">inner</p></context-provider><p data-test="reader">outer</p><span data-test="separator">-</span></context-provider><h3>Context.Provider(value, () => ) Test</h3><context-provider value="function-value"><p data-test="fn-provider">Function provider: function-value</p></context-provider><h3>Position Independence Test</h3><context-provider value="position-test"><p data-test="pos-1">Before: position-test</p><div data-test="pos-2"><p data-test="pos-2-nested">Nested Before: position-test</p></div><p data-test="pos-3">Middle: position-test</p><context-provider value="override-position"><p data-test="pos-4">Override: override-position</p></context-provider><p data-test="pos-5">After: position-test</p></context-provider><h3>isStatic Test</h3><context-provider value="observable-value"><div data-test="isstatic-test"><p data-test="isstatic-value">Value: observable-value</p><p data-test="isstatic-type">Type: string</p><p data-test="isstatic-not-function">Is not function: true</p></div></context-provider>'  // For SSR comparison
        const expected = '<context-provider value="outer"><p data-test="reader">outer</p><context-provider value="inner"><p data-test="reader">inner</p><div data-test="middle-content"><span>nested element</span></div><p data-test="nested-fn-last">inner</p></context-provider><p data-test="reader">outer</p><span data-test="separator">-</span></context-provider><h3>Context.Provider(value, () => ) Test</h3><context-provider value="function-value"><p data-test="fn-provider">Function provider: function-value</p></context-provider><h3>Position Independence Test</h3><context-provider value="position-test"><p data-test="pos-1">Before: position-test</p><div data-test="pos-2"><p data-test="pos-2-nested">Nested Before: position-test</p></div><p data-test="pos-3">Middle: position-test</p><context-provider value="override-position"><p data-test="pos-4">Override: override-position</p></context-provider><p data-test="pos-5">After: position-test</p></context-provider><h3>isStatic Test</h3><context-provider value="observable-value"><div data-test="isstatic-test"><p data-test="isstatic-value">Value: observable-value</p><p data-test="isstatic-type">Type: string</p><p data-test="isstatic-not-function">Is not function: true</p></div></context-provider>'   // For main test comparison

        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = minimiseHtml(renderToString(ssrComponent))
        if (ssrResult !== expectedFull) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestContextHook} />

// console.log(renderToString(<TestContextHook />))