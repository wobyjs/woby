import { $, $$, createContext, useContext, renderToString, jsx, customElement, useEffect, useMemo, defaults, context, type JSX } from 'woby'
import { TestSnapshots, useTimeout, TEST_INTERVAL, registerTestObservable, testObservables, assert, minimiseHtml } from './util'

const readerContext = createContext<string>()
const otherContext = createContext<string>()
customElement('reader-context', readerContext.Provider)
customElement('other-context', otherContext.Provider)

const name = 'TestContextHookHtml'
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
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}

TestContextHookHtml.test = {
    static: false,
    expect: () => {
        // SSR renders the initial HTML string (before any client-side mutations)
        const expectedFull = minimiseHtml('<div><h3>Context - Hook in HTML</h3><other-context value="123"><reader-context value="outer"><p>header</p><test-reader></test-reader><reader-context value="inner"><test-reader></test-reader></reader-context><test-reader></test-reader><p>Footer</p></reader-context></outer-context></div>')
        // After useTimeout changes other-context value from "123" to "456"
        const expected = [
            minimiseHtml('<div><other-context value="123"><template shadowrootmode="open" shadowrootserializable=""><context-provider value="123"><slot><reader-context value="outer"><template shadowrootmode="open" shadowrootserializable=""><context-provider value="outer"><slot><p>header</p><test-reader><template shadowrootmode="open" shadowrootserializable=""><p> other: </p></template></test-reader><reader-context value="inner"><template shadowrootmode="open" shadowrootserializable=""><context-provider value="inner"><slot><test-reader><template shadowrootmode="open" shadowrootserializable=""><p> other: </p></template></test-reader></slot></context-provider></template></reader-context><test-reader><template shadowrootmode="open" shadowrootserializable=""><p> other: </p></template></test-reader><p>Footer</p></slot></context-provider></template></reader-context></slot></context-provider></template></other-context></div>'),
            minimiseHtml('<div><other-context value="456"><template shadowrootmode="open" shadowrootserializable=""><context-provider value="123"><slot><reader-context value="outer"><template shadowrootmode="open" shadowrootserializable=""><context-provider value="outer"><slot><p>header</p><test-reader><template shadowrootmode="open" shadowrootserializable=""><p> other: </p></template></test-reader><reader-context value="inner"><template shadowrootmode="open" shadowrootserializable=""><context-provider value="inner"><slot><test-reader><template shadowrootmode="open" shadowrootserializable=""><p> other: </p></template></test-reader></slot></context-provider></template></reader-context><test-reader><template shadowrootmode="open" shadowrootserializable=""><p> other: </p></template></test-reader><p>Footer</p></slot></context-provider></template></reader-context></slot></context-provider></template></other-context></div>')
        ]

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


export default () => <TestSnapshots Component={TestContextHookHtml} />