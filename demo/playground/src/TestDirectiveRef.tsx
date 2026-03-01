import { $, $$, createDirective, useEffect, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestDirectiveRef = (): JSX.Element => {
    const model = (element, arg1) => {
        useEffect(() => {
            const value = `${arg1}`
            element.value = value
            element.setAttribute('value', value)
        }, { sync: true })
    }
    const Model = createDirective('model', model)
    const ret: JSX.Element = () => (
        <>
            <h3>Directive - Ref</h3>
            <input ref={Model.ref('bar')} value="foo" />
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestDirectiveRef_ssr', ret)

    return ret
}

TestDirectiveRef.test = {
    static: true,
    expect: () => {
        // Define expected values for both main test and SSR test
        const expectedFull = '<h3>Directive - Ref</h3><input value="bar">'  // For SSR comparison
        const expected = '<input value="bar">'   // For main test comparison

        const ssrComponent = testObservables['TestDirectiveRef_ssr']
        const ssrResult = renderToString(ssrComponent)
        if (ssrResult !== expectedFull) {
            assert(false, `[TestDirectiveRef] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestDirectiveRef] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestDirectiveRef} />