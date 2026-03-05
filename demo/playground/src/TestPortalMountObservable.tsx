import { $, $$, Portal, renderToString, useEnvironment, ssr, createDocument } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestPortalMountObservable = (): JSX.Element => {

    const ret: JSX.Element = () => {
        // Use a fixed DOM element for portal mounting in static test
        const containerId = 'portal-container'

        const isSSR = useEnvironment() === 'ssr'

        // In SSR mode, get the pre-created container from globalThis
        // This ensures we use the SAME container that was created before rendering
        let container = (globalThis as any).__portal_container

        if (!container) {
            // Fallback: create new container only if not provided
            const document = isSSR ? ssr.document : globalThis.document
            container = document.createElement('div')
            container.id = containerId
            document.body.appendChild(container)
        }

        return (<>
            <h3>Portal - Mount Observable</h3>
            <Portal mount={container}>
                <p>content</p>
            </Portal>
        </>)
    }
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

        const ssrComponent = testObservables['TestPortalMountObservable_ssr']
        const ssrResult = renderToString(ssrComponent)
        if (ssrResult !== expectedFull) {
            assert(false, `[TestPortalMountObservable] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestPortalMountObservable] SSR test passed: ${ssrResult}`)
        }

        return expected  // This is what the DOM test framework compares against
    }
}


export default () => <TestSnapshots Component={TestPortalMountObservable} />

// Test with isolated document context and renderToString
console.log('Testing with isolated document context...')
const doc = createDocument()
const containerId = 'portal-container'

// Pre-create the container in the document BEFORE rendering
let container = doc.createElement('div')
container.id = containerId
doc.body.appendChild(container)
console.log('Created container with ID:', container.id, 'outerHTML:', container.outerHTML)

    // Set the container in globalThis so the component can use it
    ; (globalThis as any).__portal_container = container

// The component returns a function, so we need to invoke it properly
const ComponentInstance = TestPortalMountObservable()
const result: any = renderToString(ComponentInstance as any, {
    document: doc,
    returnDocument: true
})

console.log('HTML:', result.html)
console.log('Document body innerHTML:', result.document.body.innerHTML)
console.log('Document body childNodes count:', result.document.body.childNodes?.length)
if (result.document.body.childNodes && result.document.body.childNodes.length > 0) {
    console.log('First child:', result.document.body.childNodes[0])
    console.log('First child outerHTML:', result.document.body.childNodes[0].outerHTML)
}
console.log('Container exists in body:', result.document.body.innerHTML.includes('portal-container'))

    // Cleanup
    ; (globalThis as any).__portal_container = undefined