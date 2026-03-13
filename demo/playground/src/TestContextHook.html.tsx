import { $, $$, createContext, useContext, renderToString, jsx, customElement, useMountedContext, useEffect, useMemo, defaults, context, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert, minimiseHtml } from './util'

const readerContext = createContext<string>()
const otherContext = createContext<string>()
customElement('reader-context', readerContext.Provider)
customElement('other-context', otherContext.Provider)

const TestContextHookHtml = (): JSX.Element => {
    const Reader = defaults(() => ({}), () => {
        const ctx = useContext(readerContext)
        const oth = useContext(otherContext)

        return <p>{ctx} other: {oth}</p>
    })


    customElement('test-reader', Reader)

    const ret: JSX.Element = () => (
        <div dangerouslySetInnerHTML={{
            __html: `
            <h3>Context - Hook in HTML</h3>
            <other-context value="456">
                <reader-context value="outer">
                    <p>header</p>
                    <test-reader></test-reader>
                    <reader-context value="inner">
                        <test-reader></test-reader>
                    </reader-context>
                    <test-reader></test-reader>
                    <p>Footer</p>
                </reader-context>
            </outer-context>
            `}}>

        </div>
    )

    // Store the component for SSR testing
    registerTestObservable('TestContextHook_ssr', ret)

    return ret
}

TestContextHookHtml.test = {
    static: true,
    expect: () => {
        // Define expected values for both main test and SSR test
        // Note: SSR doesn't render symbol attributes
        const expectedFull = '<div><h3>Context - Hook in HTML</h3><other-context value="123"><reader-context value="outer"><p>header</p><test-reader></test-reader><reader-context value="inner"><test-reader></test-reader></reader-context><test-reader></test-reader><p>Footer</p></reader-context></outer-context></div>'
        const expected = '<div><other-context value="123"><template shadowrootmode="open" shadowrootserializable=""><slot><reader-context value="outer"><template shadowrootmode="open" shadowrootserializable=""><slot><p>header</p><test-reader><template shadowrootmode="open" shadowrootserializable=""><p>outer other: 123</p></template></test-reader><reader-context value="inner"><template shadowrootmode="open" shadowrootserializable=""><slot><test-reader><template shadowrootmode="open" shadowrootserializable=""><p>inner other: 123</p></template></test-reader></slot></template></reader-context><test-reader><template shadowrootmode="open" shadowrootserializable=""><p>outer other: 123</p></template></test-reader><p>Footer</p></slot></template></reader-context></slot></template></other-context></div>'

        const ssrComponent = testObservables['TestContextHook_ssr']
        const ssrResult = minimiseHtml(renderToString(ssrComponent))
        if (ssrResult !== expectedFull) {
            assert(false, `[TestContextHookHtml] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [TestContextHookHtml] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestContextHookHtml} />