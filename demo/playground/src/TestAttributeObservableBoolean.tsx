import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, registerTestObservable, testObservables, assert } from './util'

const name = 'TestAttributeObservableBoolean'
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
            expected = '<p data-red="true">content</p>'
        } else {
            expected = '<p>content</p>'
        }

        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = `<h3>Attribute - Observable Boolean</h3>${expected}`
        if (ssrResult !== expectedFull) {
            assert(false, `${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ ${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestAttributeObservableBoolean} />