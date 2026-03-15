import { $, $$, Dynamic, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const name = 'TestDynamicFunctionProps'
const TestDynamicFunctionProps = (): JSX.Element => {
    const red = { class: 'red' }
    const blue = { class: 'blue' }
    const props = $(red)
    registerTestObservable('TestDynamicFunctionProps', props)
    const toggle = () => {
        props(prev => prev === red ? blue : red)
    }
    useInterval(toggle, TEST_INTERVAL)
    const ret: JSX.Element = () => (
        <>
            <h3>Dynamic - Function Props</h3>
            <Dynamic component="h5" props={props}>
                Content
            </Dynamic>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}

TestDynamicFunctionProps.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const props = $$(testObservables[name])

        // Define expected values for both main test and SSR test
        const expectedFull = `<h3>Dynamic - Function Props</h3><h5 class="${props.class}">Content</h5>`  // For SSR comparison
        const expected = `<h5 class="${props.class}">Content</h5>`   // For main test comparison

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


export default () => <TestSnapshots Component={TestDynamicFunctionProps} />

// console.log(renderToString(<TestDynamicFunctionProps />))