import { $, $$, createDirective, useEffect, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestDirective = (): JSX.Element => {
    const model = (element, arg1, arg2) => {
        useEffect(() => {
            const value = `${arg1} - ${arg2}`
            element.value = value
            element.setAttribute('value', value)
        }, { sync: true })
    }
    const Model = createDirective('model', model)
    const ret: JSX.Element = () => (
        <>
            <h3>Directive</h3>
            <Model.Provider>
                <input value="foo" use:model={['bar', 'baz']} />
            </Model.Provider>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestDirective_ssr', ret)

    return ret
}

TestDirective.test = {
    static: true,
    expect: () => {
        // Define expected values for both main test and SSR test
        const expectedFull = '<h3>Directive</h3><input value="bar - baz">'  // For SSR comparison
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