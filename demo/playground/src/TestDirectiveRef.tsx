import { $, $$, createDirective, useEffect, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

// Declare the model directive in JSX namespace
declare module 'woby' {
    namespace JSX {
        interface Directives {
            modelRef: [string]
        }
        interface HTMLAttributes<T> {
            ["use:modelRef"]?: [string]
        }
    }
}

const TestDirectiveRef = (): JSX.Element => {
    const model = (element, arg1) => {
        //actual usage -> enable this, SSR test make it stackoverflow
        // useEffect(() => {
        const value = `${arg1}`
        element.value = value
        element.setAttribute('value', value)
        //actual usage -> enable this, SSR test make it stackoverflow
        // }, { sync: true })
    }
    const Model = createDirective('modelRef', model, { immediate: true }  /* actual usage -> disable this  */)
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
        const expectedFull = '<h3>Directive - Ref</h3><input value="bar" />'  // For SSR comparison
        const expected = '<input value="bar">'   // For main test comparison

        const ssrComponent = testObservables['TestDirectiveRef_ssr']
        const ssrResult = renderToString(ssrComponent)
        if (ssrResult !== expectedFull) {
            assert(false, `[TestDirectiveRef] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [TestDirectiveRef] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestDirectiveRef} />