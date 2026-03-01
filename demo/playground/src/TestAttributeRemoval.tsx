import { $, $$, renderToString } from 'woby'
import { TestSnapshots, registerTestObservable, testObservables, assert } from './util'

const TestAttributeRemoval = (): JSX.Element => {
    const o = $<string | null>(null)  // Start with null to test removal
    registerTestObservable('TestAttributeRemoval', o)
    const ret: JSX.Element = () => (
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

        const ssrComponent = testObservables['TestAttributeRemoval_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = `<h3>Attribute - Removal</h3>${expected}`
        if (ssrResult !== expectedFull) {
            assert(false, `[TestAttributeRemoval] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestAttributeRemoval] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestAttributeRemoval} />