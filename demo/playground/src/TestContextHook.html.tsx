import { $, $$, createContext, useContext, renderToString, jsx, customElement, useMountedContext, useEffect, useMemo, defaults, context, type JSX } from 'woby'
import { TestSnapshots, useTimeout, TEST_INTERVAL, registerTestObservable, testObservables, assert, minimiseHtml } from './util'

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

    // Programmatically change other-context value from "123" to "123" after mount
    useTimeout(() => {
        const otherContextEl = document.querySelector('other-context')
        if (otherContextEl) {
            otherContextEl.setAttribute('value', '456')
        }
    }, TEST_INTERVAL)

    const ret: JSX.Element = () => (
        <div dangerouslySetInnerHTML={{
            __html: `
            <h3>Context - Hook in HTML</h3>
                <other-context value="123">
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
    static: false,
    expect: () => {
        // SSR renders the initial HTML string (before any client-side mutations)
        const expectedFull = '<div><h3>Context - Hook in HTML</h3><other-context value="123"><reader-context value="outer"><p>header</p><test-reader></test-reader><reader-context value="inner"><test-reader></test-reader></reader-context><test-reader></test-reader><p>Footer</p></reader-context></outer-context></div>'
        // After useInterval changes value from "123" to "123", all test-readers show "123"
        const expected = [
            '<div><other-context value="123"><template shadowrootmode="open" shadowrootserializable=""><slot><reader-context value="outer"><template shadowrootmode="open" shadowrootserializable=""><slot><p>header</p><test-reader><template shadowrootmode="open" shadowrootserializable=""><p>outer other: 123</p></template></test-reader><reader-context value="inner"><template shadowrootmode="open" shadowrootserializable=""><slot><test-reader><template shadowrootmode="open" shadowrootserializable=""><p>inner other: 123</p></template></test-reader></slot></template></reader-context><test-reader><template shadowrootmode="open" shadowrootserializable=""><p>outer other: 123</p></template></test-reader><p>Footer</p></slot></template></reader-context></slot></template></other-context></div>',
            '<div><other-context value="456"><template shadowrootmode="open" shadowrootserializable=""><slot><reader-context value="outer"><template shadowrootmode="open" shadowrootserializable=""><slot><p>header</p><test-reader><template shadowrootmode="open" shadowrootserializable=""><p>outer other: 123</p></template></test-reader><reader-context value="inner"><template shadowrootmode="open" shadowrootserializable=""><slot><test-reader><template shadowrootmode="open" shadowrootserializable=""><p>inner other: 123</p></template></test-reader></slot></template></reader-context><test-reader><template shadowrootmode="open" shadowrootserializable=""><p>outer other: 123</p></template></test-reader><p>Footer</p></slot></template></reader-context></slot></template></other-context></div>'
        ]

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