import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestAttributeFunction = (): JSX.Element => {
    const o = $('red')
    // Store the observable globally so the test can access it
    registerTestObservable('TestAttributeFunction', o)
    const toggle = () => o(prev => (prev === 'red') ? 'blue' : 'red')
    useInterval(toggle, TEST_INTERVAL)
    const ret: JSX.Element = (
        <>
            <h3>Attribute - Function</h3>
            <p data-color={() => `dark${o()}`}>content</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestAttributeFunction_ssr', ret)

    return ret
}

TestAttributeFunction.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const value = $$(testObservables['TestAttributeFunction'])
        const expected = `<p data-color="dark${value}">content</p>`

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestAttributeFunction_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    const expectedFull = `<h3>Attribute - Function</h3>${expected}`
                    if (ssrResult !== expectedFull) {
                        assert(false, `[TestAttributeFunction] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
                    } else {
                        console.log(`✅ [TestAttributeFunction] SSR test passed: ${ssrResult}`)
                    }
                }).catch(err => {
                    console.error(`[TestAttributeFunction] SSR render error: ${err}`)
                })
            }
        }, 0)

        return expected
    }
}


export default () => <TestSnapshots Component={TestAttributeFunction} />