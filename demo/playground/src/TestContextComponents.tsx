import { $, $$, createContext, useContext, renderToString, jsx, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const name = 'TestContextComponents'
const TestContextComponents = (): JSX.Element => {
    const Context = createContext('')

    // Helper components to properly use useContext hook
    const FirstFnChild = () => <p data-test="first-fn">{useContext(Context)}</p>
    const LastFnChild = () => <p data-test="last-fn">{useContext(Context)}</p>
    const NestedFirstChild = () => <p data-test="nested-first">{useContext(Context)}</p>
    const NestedLastChild = () => <p data-test="nested-last">{useContext(Context)}</p>
    const FnProviderChild = () => {
        const ctxValue = useContext(Context)
        return <p data-test="fn-provider">Component function provider: {ctxValue}</p>
    }
    const Sibling1 = () => <p data-test="sibling-1">First: {useContext(Context)}</p>
    const Sibling2 = () => <p data-test="sibling-2">Second: {useContext(Context)}</p>
    const Sibling3Nested = () => <p data-test="sibling-3-nested">Nested: {useContext(Context)}</p>
    const Sibling4 = () => <p data-test="sibling-4">Last: {useContext(Context)}</p>

    const ret: JSX.Element = () => (
        <>
            <h3>Context - Components</h3>
            <Context.Provider value="outer">
                {/* First child - function component */}
                <FirstFnChild />

                {/* Second child - regular element */}
                <span data-test="first-span">separator</span>

                {/* Third child - nested provider with children at different positions */}
                <Context.Provider value="inner">
                    {/* First child in nested provider */}
                    <NestedFirstChild />

                    {/* Middle child - another nested element */}
                    <div data-test="nested-middle">
                        <span>nested content</span>
                    </div>

                    {/* Last child in nested provider */}
                    <NestedLastChild />
                </Context.Provider>

                {/* Last child - function component after nested provider */}
                <LastFnChild />
            </Context.Provider>

            {/* Context.Provider with function children test */}
            <h3>Context.Provider(value, () =&gt; ) Test</h3>
            {() => jsx(Context.Provider, {
                value: "component-function-value",
                children: FnProviderChild
            })}

            {/* Additional test: Multiple siblings in provider */}
            <h3>Multiple Siblings Test</h3>
            <Context.Provider value="multi-test">
                <Sibling1 />
                <Sibling2 />
                <div data-test="sibling-3">
                    <Sibling3Nested />
                </div>
                <Sibling4 />
            </Context.Provider>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}

TestContextComponents.test = {
    static: true,
    expect: () => {
        // Define expected values for both main test and SSR test
        // Note: SSR doesn't render symbol attributes
        const expectedFull = '<h3>Context - Components</h3><context-provider value="outer"><p data-test="first-fn">outer</p><span data-test="first-span">separator</span><context-provider value="inner"><p data-test="nested-first">inner</p><div data-test="nested-middle"><span>nested content</span></div><p data-test="nested-last">inner</p></context-provider><p data-test="last-fn">outer</p></context-provider><h3>Context.Provider(value, () => ) Test</h3><context-provider value="component-function-value"><p data-test="fn-provider">Component function provider: component-function-value</p></context-provider><h3>Multiple Siblings Test</h3><context-provider value="multi-test"><p data-test="sibling-1">First: multi-test</p><p data-test="sibling-2">Second: multi-test</p><div data-test="sibling-3"><p data-test="sibling-3-nested">Nested: multi-test</p></div><p data-test="sibling-4">Last: multi-test</p></context-provider>'  // For SSR comparison
        const expected = '<context-provider value="outer"><p data-test="first-fn">outer</p><span data-test="first-span">separator</span><context-provider value="inner"><p data-test="nested-first">inner</p><div data-test="nested-middle"><span>nested content</span></div><p data-test="nested-last">inner</p></context-provider><p data-test="last-fn">outer</p></context-provider><h3>Context.Provider(value, () => ) Test</h3><context-provider value="component-function-value"><p data-test="fn-provider">Component function provider: component-function-value</p></context-provider><h3>Multiple Siblings Test</h3><context-provider value="multi-test"><p data-test="sibling-1">First: multi-test</p><p data-test="sibling-2">Second: multi-test</p><div data-test="sibling-3"><p data-test="sibling-3-nested">Nested: multi-test</p></div><p data-test="sibling-4">Last: multi-test</p></context-provider>'   // For main test comparison

        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        if (ssrResult !== expectedFull) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestContextComponents} />

// console.log(renderToString(<TestContextComponents />))