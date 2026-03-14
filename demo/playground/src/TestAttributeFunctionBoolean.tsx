import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, registerTestObservable, testObservables, assert, TEST_INTERVAL } from './util'

const name = 'TestAttributeFunctionBoolean'
const TestAttributeFunctionBoolean = (): JSX.Element => {
    const o = $(true)
    const toggle = () => o(prev => !prev)
    registerTestObservable('TestAttributeFunctionBoolean', o)

    useInterval(toggle, TEST_INTERVAL)

    const ret: JSX.Element = () => (
        <>
            <h3>Attribute - Function Boolean</h3>
            <p data-red={() => !o()}>content</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}

TestAttributeFunctionBoolean.test = {
    static: false, // Make it static for predictable testing
    compareActualValues: true,
    expect: () => {
        const value = $$(testObservables[name])
        // Since the attribute uses !o(), when o() is true, the attr value is false
        const attrValue = !value
        let expected: string
        if (attrValue) {
            expected = '<p data-red="true">content</p>'
        } else {
            expected = '<p>content</p>'
        }

        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = `<h3>Attribute - Function Boolean</h3>${expected}`
        if (ssrResult !== expectedFull) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ ${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestAttributeFunctionBoolean} />