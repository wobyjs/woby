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

        const ssrComponent = testObservables['TestCleanupInnerPortal_ssr']
        const ssrResult = renderToString(ssrComponent)
        if (ssrResult !== expected) {
            assert(false, `[TestCleanupInnerPortal] SSR mismatch: got ${ssrResult}, expected ${expected}`)
        } else {
            console.log(`✅ [TestCleanupInnerPortal] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestCleanupInnerPortal} />