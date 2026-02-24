import { $, $$, If, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestNestedIfs = (): JSX.Element => {
    const ret: JSX.Element = (
        <>
            <If when={true}>
                <If when={true}>
                    <div>1</div>
                    <div>2</div>
                </If>
                <div>Footer</div>
            </If>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestNestedIfs_ssr', ret)

    return ret
}

TestNestedIfs.test = {
    static: true,
    expect: () => {
        // Define expected values for both main test and SSR test
        const expectedFull = '<div>1</div><div>2</div><div>Footer</div>'  // For SSR comparison
        const expected = '<div>1</div><div>2</div><div>Footer</div>'   // For main DOM test comparison

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestNestedIfs_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                // If it's a JSX element or function, we can render it to string
                // If it's a function, we need to call it first to get the element
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    if (ssrResult !== expectedFull) {
                        assert(false, `SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
                    } else {
                        console.log(`✅ SSR test passed: ${ssrResult}`)
                    }
                }).catch(err => {
                    console.error(`SSR render error: ${err}`)
                })
            }
        }, 0)

        return expected  // This is what the DOM test framework compares against
    }
}


export default () => <TestSnapshots Component={TestNestedIfs} />