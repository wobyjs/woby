import { $, $$, renderToString } from 'woby'
import { TestSnapshots, registerTestObservable, testObservables, assert } from './util'

const TestIdRemoval = (): JSX.Element => {
    const o = $<string | null>(null)  // Start with null to test removal
    registerTestObservable('TestIdRemoval', o)
    const ret: JSX.Element = (
        <>
            <h3>ID - Removal</h3>
            <p id={o}>content</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestIdRemoval_ssr', ret)

    return ret
}

TestIdRemoval.test = {
    static: true, // Make it static for predictable testing
    compareActualValues: true,
    expect: () => {
        const value = $$(testObservables['TestIdRemoval'])
        const expected = value ? `<p id="${value}">content</p>` : '<p>content</p>'

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestIdRemoval_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    const expectedFull = value ? `<h3>ID - Removal</h3><p id="${value}">content</p>` : '<h3>ID - Removal</h3><p>content</p>'
                    if (ssrResult !== expectedFull) {
                        assert(false, `[TestIdRemoval] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
                    } else {
                        console.log(`✅ [TestIdRemoval] SSR test passed: ${ssrResult}`)
                    }
                }).catch(err => {
                    console.error(`[TestIdRemoval] SSR render error: ${err}`)
                })
            }
        }, 0)

        return expected
    }
}


export default () => <TestSnapshots Component={TestIdRemoval} />