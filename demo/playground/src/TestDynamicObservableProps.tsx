import { $, $$, Dynamic, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestDynamicObservableProps = (): JSX.Element => {
    const red = { class: 'red' }
    const blue = { class: 'blue' }
    const props = $(red)
    registerTestObservable('TestDynamicObservableProps', props)
    const toggle = () => {
        props(prev => prev === red ? blue : red)
    }
    useInterval(toggle, TEST_INTERVAL)
    const ret: JSX.Element = (
        <>
            <h3>Dynamic - Observable Props</h3>
            <Dynamic component="h5" props={props}>
                Content
            </Dynamic>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestDynamicObservableProps_ssr', ret)

    return ret
}

TestDynamicObservableProps.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const props = $$(testObservables['TestDynamicObservableProps'])

        // Define expected values for both main test and SSR test
        const expectedFull = `<h3>Dynamic - Observable Props</h3><h5 class="${props.class}">Content</h5>`  // For SSR comparison
        const expected = `<h5 class="${props.class}">Content</h5>`   // For main test comparison

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestDynamicObservableProps_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                // If it's a JSX element or function, we can render it to string
                // If it's a function, we need to call it first to get the element
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    if (ssrResult !== expectedFull) {
                        assert(false, `[TestDynamicObservableProps] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
                    } else {
                        console.log(`✅ [TestDynamicObservableProps] SSR test passed: ${ssrResult}`)
                    }
                }).catch(err => {
                    console.error(`[TestDynamicObservableProps] SSR render error: ${err}`)
                })
            }
        }, 0)

        return expected
    }
}


export default () => <TestSnapshots Component={TestDynamicObservableProps} />