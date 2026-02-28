import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestAttributeObservable = (): JSX.Element => {
    const o = $('red')
    // Store the observable globally so the test can access it
    registerTestObservable('TestAttributeObservable', o)
    const toggle = () => o(prev => (prev === 'red') ? 'blue' : 'red')
    useInterval(toggle, TEST_INTERVAL)
    const ret: JSX.Element = (
        <>
            <h3>Attribute - Observable</h3>
            <p data-color={o}>content</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestAttributeObservable_ssr', ret)

    return ret
}

TestAttributeObservable.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const value = $$(testObservables['TestAttributeObservable'])
        const expected = `<p data-color="${value}">content</p>`

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestAttributeObservable_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    const expectedFull = `<h3>Attribute - Observable</h3>${expected}`
                    if (ssrResult !== expectedFull) {
                        assert(false, `[TestAttributeObservable] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
                    } else {
                        console.log(`✅ [TestAttributeObservable] SSR test passed: ${ssrResult}`)
                    }
                }).catch(err => {
                    console.error(`[TestAttributeObservable] SSR render error: ${err}`)
                })
            }
        }, 0)

        return expected
    }
}


export default () => <TestSnapshots Component={TestAttributeObservable} />