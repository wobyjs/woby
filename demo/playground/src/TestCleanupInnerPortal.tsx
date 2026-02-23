import { $, $$, Portal, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'
import TestCleanupInner from './TestCleanupInner'

const TestCleanupInnerPortal = () => {
    const ret = (
        <Portal mount={document.body}>
            <TestCleanupInner />
        </Portal>
    )

    // Store the component for SSR testing
    registerTestObservable('TestCleanupInnerPortal_ssr', ret)

    return ret
}

TestCleanupInnerPortal.test = {
    static: true,
    compareActualValues: true,
    expect: () => {
        const expected = '<!---->'

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestCleanupInnerPortal_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    if (ssrResult !== expected) {
                        assert(false, `SSR mismatch: got ${ssrResult}, expected ${expected}`)
                    } else {
                        console.log(`✅ SSR test passed: ${ssrResult}`)
                    }
                }).catch(err => {
                    console.error(`SSR render error: ${err}`)
                })
            }
        }, 0)

        return expected
    }
}


export default () => <TestSnapshots Component={TestCleanupInnerPortal} />