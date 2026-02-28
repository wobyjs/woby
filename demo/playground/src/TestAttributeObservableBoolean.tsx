import { $, $$, renderToString } from 'woby'
import { TestSnapshots, registerTestObservable, testObservables, assert } from './util'

const TestAttributeObservableBoolean = (): JSX.Element => {
    const o = $(false)
    registerTestObservable('TestAttributeObservableBoolean', o)
    const ret: JSX.Element = (
        <>
            <h3>Attribute - Observable Boolean</h3>
            <p data-red={o}>content</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestAttributeObservableBoolean_ssr', ret)

    return ret
}

TestAttributeObservableBoolean.test = {
    static: true, // Make it static for predictable testing
    compareActualValues: true,
    expect: () => {
        const value = $$(testObservables['TestAttributeObservableBoolean'])
        let expected: string
        if (value) {
            expected = '<p data-red="true">content</p>'
        } else {
            expected = '<p data-red="false">content</p>'
        }

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestAttributeObservableBoolean_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    const expectedFull = `<h3>Attribute - Observable Boolean</h3>${expected}`
                    if (ssrResult !== expectedFull) {
                        assert(false, `[TestAttributeObservableBoolean] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
                    } else {
                        console.log(`✅ [TestAttributeObservableBoolean] SSR test passed: ${ssrResult}`)
                    }
                }).catch(err => {
                    console.error(`[TestAttributeObservableBoolean] SSR render error: ${err}`)
                })
            }
        }, 0)

        return expected
    }
}


export default () => <TestSnapshots Component={TestAttributeObservableBoolean} />