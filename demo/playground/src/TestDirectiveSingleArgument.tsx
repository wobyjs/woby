import { $, $$, createDirective, useEffect, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

// Declare the model directive in JSX namespace
declare module 'woby' {
    namespace JSX {
        interface Directives {
            modelSingle: [string]
        }
        interface HTMLAttributes<T> {
            ["use:modelSingle"]?: [string]
        }
    }
}

const name = 'TestDirectiveSingleArgument'
const TestDirectiveSingleArgument = (): JSX.Element => {
    const model = (element, arg1) => {
        //actual usage -> enable this, SSR test make it stackoverflow
        // useEffect(() => {
        const value = `${arg1}`
        element.value = value
        element.setAttribute('value', value)
        //actual usage -> enable this, SSR test make it stackoverflow
        // }, { sync: true })
    }
    const Model = createDirective('modelSingle', model, { immediate: true } /* actual usage -> disable this */)
    const ret: JSX.Element = () => (
        <>
            <h3>Directive - Single Argument</h3>
            <Model.Provider>
                <input value="foo" use:modelSingle="bar" />
            </Model.Provider>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}

TestDirectiveSingleArgument.test = {
    static: true,
    expect: () => {
        // Define expected values for both main test and SSR test
        const expectedFull = '<h3>Directive - Single Argument</h3><input value="bar" />'  // For SSR comparison
        const expected = '<input value="bar">'   // For main test comparison

        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        if (ssrResult !== expectedFull) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestDirectiveSingleArgument} />