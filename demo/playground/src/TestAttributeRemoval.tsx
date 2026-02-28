import { $, $$, renderToString } from 'woby'
import { TestSnapshots, registerTestObservable, testObservables, assert } from './util'

const TestAttributeRemoval = (): JSX.Element => {
    const o = $<string | null>(null)  // Start with null to test removal
    registerTestObservable('TestAttributeRemoval', o)
    const ret: JSX.Element = (
        <>
            <h3>Attribute - Removal</h3>
            <p data-color={o}>content</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestAttributeRemoval_ssr', ret)

    return ret
}

TestAttributeRemoval.test = {
    static: true, // Make it static for predictable testing
    compareActualValues: true,
    expect: () => {
        const value = $$(testObservables['TestAttributeRemoval'])
        const expected = value ? `<p data-color="${value}">content</p>` : '<p>content</p>'

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestAttributeRemoval_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    const expectedFull = `<h3>Attribute - Removal</h3>${expected}`
                    if (ssrResult !== expectedFull) {
                        assert(false, `[TestAttributeRemoval] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
                    } else {
                        console.log(`✅ [TestAttributeRemoval] SSR test passed: ${ssrResult}`)
                    }
                }).catch(err => {
                    console.error(`[TestAttributeRemoval] SSR render error: ${err}`)
                })
            }
        }, 0)

        return expected
    }
}


export default () => <TestSnapshots Component={TestAttributeRemoval} />