import { $, $$, Dynamic, useMemo, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestDynamicObservableComponent = (): JSX.Element => {
    const level = $(1)
    registerTestObservable('TestDynamicObservableComponent', level)
    const component = useMemo(() => `h${level()}`)
    const increment = () => {
        level((level() + 1) % 7 || 1)
    }
    useInterval(increment, TEST_INTERVAL)
    const ret: JSX.Element = (
        <>
            <h3>Dynamic - Observable Component</h3>
            <Dynamic component={component}>
                Level: {level}
            </Dynamic>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestDynamicObservableComponent_ssr', ret)

    return ret
}

TestDynamicObservableComponent.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const level = $$(testObservables['TestDynamicObservableComponent'])

        // Define expected values for both main test and SSR test
        const expectedFull = `<h3>Dynamic - Observable Component</h3><h${level}>Level: ${$$(level)}</h${level}>`  // For SSR comparison
        const expected = `<h${level}>Level: ${$$(level)}</h${level}>`   // For main test comparison

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestDynamicObservableComponent_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                // If it's a JSX element or function, we can render it to string
                // If it's a function, we need to call it first to get the element
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    if (ssrResult !== expectedFull) {
                        assert(false, `[TestDynamicObservableComponent] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
                    } else {
                        console.log(`✅ [TestDynamicObservableComponent] SSR test passed: ${ssrResult}`)
                    }
                }).catch(err => {
                    console.error(`[TestDynamicObservableComponent] SSR render error: ${err}`)
                })
            }
        }, 0)

        return expected
    }
}


export default () => <TestSnapshots Component={TestDynamicObservableComponent} />