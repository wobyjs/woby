import { $, $$, createDirective, useEffect, renderToString, tick } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

// Declare the model directive in JSX namespace
declare module 'woby' {
    namespace JSX {
        interface Directives {
            modelDouble: [string, string]
        }
        interface HTMLAttributes<T> {
            ["use:modelDouble"]?: [string, string]
        }
    }
}

const TestDirective = (): JSX.Element => {
    const model = (element, arg1, arg2) => {
        //actual usage -> enable this, SSR test make it stackoverflow
        // useEffect(() => {
        //console.log('model -> useEffect')
        const value = `${arg1} - ${arg2}`
        element.value = value
        element.setAttribute('value', value)
        //actual usage -> enable this
        // }, { sync: true })
    }
    const Model = createDirective('modelDouble', model, { immediate: true } /* actual usage -> disable this */)

    const ret: JSX.Element = () => {
        return <>
            <h3>Directive</h3>
            <Model.Provider>
                <input value="foo" use:modelDouble={['bar', 'baz']} />
            </Model.Provider>
        </>
    }

    // Store the component for SSR testing
    registerTestObservable('TestDirective_ssr', ret)

    return ret
}

TestDirective.test = {
    static: true,
    expect: () => {
        // Define expected values for both main test and SSR test
        const expectedFull = '<h3>Directive</h3><input value="bar - baz"></input>'  // For SSR comparison
        const expected = '<input value="bar - baz">'   // For main test comparison

        const ssrComponent = testObservables['TestDirective_ssr']
        const ssrResult = renderToString(ssrComponent)
        if (ssrResult !== expectedFull) {
            assert(false, `[TestDirective] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestDirective] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestDirective} />