import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestSymbolFunction = (): JSX.Element => {
    const o = $(Symbol())
    const randomize = () => o(Symbol())
    useInterval(randomize, TEST_INTERVAL)
    const ret: JSX.Element = (
        <>
            <h3>Symbol - Function</h3>
            <p>{() => o()}</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestSymbolFunction_ssr', ret)

    return ret
}

TestSymbolFunction.test = {
    static: true,
    expect: () => {
        const expected = '<p><!----></p>'

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestSymbolFunction_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    const expectedFull = '<h3>Symbol - Function</h3><p><!----></p>'
                    if (ssrResult !== expectedFull) {
                        assert(false, `[TestSymbolFunction] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
                    } else {
                        console.log(`✅ [TestSymbolFunction] SSR test passed: ${ssrResult}`)
                    }
                }).catch(err => {
                    console.error(`[TestSymbolFunction] SSR render error: ${err}`)
                })
            }
        }, 0)

        return expected
    }
}


export default () => <TestSnapshots Component={TestSymbolFunction} />