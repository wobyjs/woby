import { $, $$, createDirective, useEffect, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

// Declare the modelLocal directive in JSX namespace
declare module 'woby' {
    namespace JSX {
        interface Directives {
            modelLocal: [string, string]
        }
        interface HTMLAttributes<T> {
            ["use:modelLocal"]?: [string, string]
        }
    }
}

const TestDirectiveRegisterLocal = (): JSX.Element => {
    const model = (element, arg1, arg2) => {
        //actual usage -> enable this, SSR test make it stackoverflow
        // useEffect(() => {
        const value = `${arg1} - ${arg2}`
        element.value = value
        element.setAttribute('value', value)
        //actual usage -> enable this, SSR test make it stackoverflow
        // }, { sync: true })
    }
    const Model = createDirective('modelLocal', model, { immediate: true }  /* actual usage -> disable this  */)
    Model.register()
    const ret: JSX.Element = () => (
        <>
            <h3>Directive</h3>
            <input value="foo" use:modelLocal={['bar', 'baz']} />
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestDirectiveRegisterLocal_ssr', ret)

    return ret
}

TestDirectiveRegisterLocal.test = {
    static: true,
    expect: () => {
        // Define expected values for both main test and SSR test
        const expectedFull = '<h3>Directive</h3><input value="bar - baz">'  // For SSR comparison
        const expected = '<input value="bar - baz">'   // For main test comparison

        const ssrComponent = testObservables['TestDirectiveRegisterLocal_ssr']
        const ssrResult = renderToString(ssrComponent)
        if (ssrResult !== expectedFull) {
            assert(false, `[TestDirectiveRegisterLocal] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestDirectiveRegisterLocal] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestDirectiveRegisterLocal} />