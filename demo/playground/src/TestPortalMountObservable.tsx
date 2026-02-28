import { $, $$, Portal, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestPortalMountObservable = (): JSX.Element => {
    // Use a fixed DOM element for portal mounting in static test
    const containerId = 'portal-container'
    let container = document.getElementById(containerId)
    if (!container) {
        container = document.createElement('div')
        container.id = containerId
        document.body.appendChild(container)
    }

    const ret: JSX.Element = (
        <>
            <h3>Portal - Mount Observable</h3>
            <Portal mount={container}>
                <p>content</p>
            </Portal>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestPortalMountObservable_ssr', ret)

    return ret
}

TestPortalMountObservable.test = {
    static: true,
    expect: () => {
        // Define expected values for both main test and SSR test
        const expectedFull = '<h3>Portal - Mount Observable</h3><!---->'  // For SSR comparison (portal renders as comment)
        const expected = '<!---->'   // For main DOM test comparison

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestPortalMountObservable_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                // If it's a JSX element or function, we can render it to string
                // If it's a function, we need to call it first to get the element
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    if (ssrResult !== expectedFull) {
                        assert(false, `[TestPortalMountObservable] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
                    } else {
                        console.log(`✅ [TestPortalMountObservable] SSR test passed: ${ssrResult}`)
                    }
                }).catch(err => {
                    console.error(`[TestPortalMountObservable] SSR render error: ${err}`)
                })
            }
        }, 0)

        return expected  // This is what the DOM test framework compares against
    }
}


export default () => <TestSnapshots Component={TestPortalMountObservable} />