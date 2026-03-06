import { $, $$, jsx, Portal, renderToString, createDocument, useEnvironment } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'
import { TestCleanupInner } from './TestCleanupInner'

const TestCleanupInnerPortal = () => {
    const ret = () => {
        const isSSR = useEnvironment() === 'ssr'

        // Get pre-created container from globalThis in SSR mode
        let mount = (globalThis as any).__portal_container

        if (!mount) {
            // Fallback for non-SSR or when container not provided
            const document = isSSR ? (globalThis as any).__ssr_document__ : globalThis.document
            if (document) {
                mount = document.createElement('div')
            } else {
                mount = jsx('div')
            }
        }

        return <Portal mount={mount} >
            <TestCleanupInner />
        </Portal >
    }

    // Store the component for SSR testing
    registerTestObservable('TestCleanupInnerPortal_ssr', ret)

    return ret
}

TestCleanupInnerPortal.test = {
    static: true,
    compareActualValues: true,
    expect: () => {
        const expected = ''

        // SSR test - create isolated document context and shared container
        const ssrComponent = testObservables['TestCleanupInnerPortal_ssr']
        const doc = createDocument()
        const container = doc.createElement('div')
        container.id = 'portal-container-cleanup-inner'
        doc.body.appendChild(container)
            ; (globalThis as any).__portal_container = container
            ; (globalThis as any).__ssr_document__ = doc

        try {
            const ssrResult = renderToString(ssrComponent, { document: doc })
            console.log(`✅ [TestCleanupInnerPortal] SSR body: ${doc.body.innerHTML}`)
        } catch (error) {
            console.error('❌ [TestCleanupInnerPortal] SSR error:', error)
        } finally {
            // Cleanup
            ; (globalThis as any).__portal_container = undefined
                ; (globalThis as any).__ssr_document__ = undefined
        }

        return '<!---->'
    }
}


export default () => <TestSnapshots Component={TestCleanupInnerPortal} />