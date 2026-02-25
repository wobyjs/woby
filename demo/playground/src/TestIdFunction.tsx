import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestIdFunction = (): JSX.Element => {
    const o = $('foo')
    registerTestObservable('TestIdFunction', o)
    const toggle = () => o(prev => (prev === 'foo') ? 'bar' : 'foo')
    useInterval(toggle, TEST_INTERVAL)
    const ret: JSX.Element = (
        <>
            <h3>ID - Function</h3>
            <p id={() => o()}>content</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestIdFunction_ssr', ret)

    return ret
}

TestIdFunction.test = {
    static: false,
    expect: () => {
        const value = $$(testObservables['TestIdFunction'])
        const expected = `<p id="${value}">content</p>`

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestIdFunction_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    const expectedFull = `<h3>ID - Function</h3><p id="${value}">content</p>`
                    if (ssrResult !== expectedFull) {
                        assert(false, `[TestIdFunction] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
                    } else {
                        console.log(`✅ [TestIdFunction] SSR test passed: ${ssrResult}`)
                    }
                }).catch(err => {
                    console.error(`[TestIdFunction] SSR render error: ${err}`)
                })
            }
        }, 0)

        return expected
    }
}


export default () => <TestSnapshots Component={TestIdFunction} />