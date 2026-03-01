import { $, $$, renderToString } from 'woby'
import { TestSnapshots, registerTestObservable, testObservables, assert } from './util'

const TestAttributeFunctionBoolean = (): JSX.Element => {
    const o = $(true)
    registerTestObservable('TestAttributeFunctionBoolean', o)
    const ret: JSX.Element = () => (
        <>
            <h3>Attribute - Function Boolean</h3>
            <p data-red={() => !o()}>content</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestAttributeFunctionBoolean_ssr', ret)

    return ret
}

TestAttributeFunctionBoolean.test = {
    static: true, // Make it static for predictable testing
    compareActualValues: true,
    expect: () => {
        const value = $$(testObservables['TestAttributeFunctionBoolean'])
        // Since the attribute uses !o(), when o() is true, the attr value is false
        const attrValue = !value
        let expected: string
        if (attrValue) {
            expected = '<p data-red="true">content</p>'
        } else {
            expected = '<p data-red="false">content</p>'
        }

        const ssrComponent = testObservables['TestAttributeFunctionBoolean_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = `<H3>Attribute - Function Boolean</H3>${expected}`
        if (ssrResult !== expectedFull) {
            assert(false, `[TestAttributeFunctionBoolean] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestAttributeFunctionBoolean] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestAttributeFunctionBoolean} />