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
    const ret: JSX.Element = (
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

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestDirectiveRef_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                // If it's a JSX element or function, we can render it to string
                // If it's a function, we need to call it first to get the element
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    if (ssrResult !== expectedFull) {
                        assert(false, `[TestDirectiveRef] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
                    } else {
                        console.log(`✅ [TestDirectiveRef] SSR test passed: ${ssrResult}`)
                    }
                }).catch(err => {
                    console.error(`[TestDirectiveRef] SSR render error: ${err}`)
                })
            }
        }, 0)

        return expected
    }
}


export default () => <TestSnapshots Component={TestDirectiveRef} />