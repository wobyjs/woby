import { $, $$, renderToString } from 'woby'
import { TestSnapshots, registerTestObservable, testObservables, assert } from './util'

const TestAttributeObservableBoolean = (): JSX.Element => {
    const o = $(false)
    registerTestObservable('TestAttributeObservableBoolean', o)
    const ret: JSX.Element = () => (
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
            expected = '<P data-red="true">content</P>'
        } else {
            expected = '<P data-red="false">content</P>'
        }

        const ssrComponent = testObservables['TestAttributeObservableBoolean_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = `<H3>Attribute - Observable Boolean</H3>${expected}`
        if (ssrResult !== expectedFull) {
            assert(false, `[TestAttributeObservableBoolean] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestAttributeObservableBoolean] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestAttributeObservableBoolean} />