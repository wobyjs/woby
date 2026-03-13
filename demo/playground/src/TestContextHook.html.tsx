import { $, $$, createContext, useContext, renderToString, jsx, customElement, useMountedContext, useEffect, useMemo, defaults, context, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const readerContext = createContext<string>($())
customElement('reader-context', readerContext.Provider)

const TestContextHookHtml = (): JSX.Element => {
    // const Context = createContext('')

    // Register Reader as a custom element
    const Reader = defaults(() => ({}), () => {
        // const { mounted, context: ctx0 } = useMountedContext(readerContext)
        const ref = $()
        const ctx = useMemo(() => {
            $$(ref)
            const ctx = useContext(readerContext)

            console.log('[Reader] useEffect', $$(ctx), /* $$(ctx0)) */ context(readerContext.symbol))
            return ctx
        }
        )
        // console.log('[Reader] ctx:', $$(ctx))
        // console.log('[Reader] context value:', $$(ctx0))

        useEffect(() => {
            console.log('[Reader] ref', $$(ref))
        })

        return <p ref={ref}>{ctx}{/* {mounted} */}</p>
    })


    customElement('test-reader', Reader)

    const ret: JSX.Element = () => (
        <div dangerouslySetInnerHTML={{
            __html: `
            <h3>Context - Hook in HTML</h3>
            <reader-context value="outer">
                <p>header</p>
                <reader-context value="inner">
                    <test-reader />/
                </reader-context>
                <Reader />
                <p>Footer</p>
            </reader-context>
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
        const expectedFull = '<h3>Context - Hook</h3><context-provider value="outer"><p>outer</p><context-provider value="inner"><p>inner</p></context-provider><p>outer</p></context-provider><h3>context.provider(value, () => ) Test</h3><context-provider value="function-value"><p>Function provider: function-value</p></context-provider>'  // For SSR comparison
        const expected = '<context// -provider value="outer"><p>outer</p><conTestContextHook_ssr="inner"><// p>inner</p></context-provider><p>outer</p></context-prov// ider><h3>context.provider(value, () => ) Te// st</h3><context-provider value="function-value"><p>Function provider: function-value</p></context-provider>'   ////  For main test com// parison

        // const ssrComponent = testObservables['TestContextHook_ssr']
        // const ssrResult = renderToString(ssrComponent)
        // if (ssrResult !== expectedFull) {
        //     assert(false, `[TestContextHookHtml] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        // } else {
        //     console.log(`✅ [TestContextHookHtml] SSR test passed: ${ssrResult}`)
        // }

        return expected
    }
}


export default () => <TestSnapshots Component={TestContextHookHtml} />