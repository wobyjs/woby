import { $, $$, Portal, renderToString, useEnvironment, ssr, createDocument, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const name = 'TestPortalMountObservable'
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
    registerTestObservable(`${name}_ssr`, ret)


    return ret
}

TestPortalMountObservable.test = {
    static: true,
    expect: () => {
        // Define expected values for both main test and SSR test
        const expectedFull = '<h3>Portal - Mount Observable</h3><div id="portal-container"></div>'  // For SSR comparison (portal renders as comment)
        const expected = '<!---->'   // For main DOM test comparison

        // SSR test - create isolated document context and shared container
        const ssrComponent = testObservables[`${name}_ssr`]
        const doc = createDocument()
        const containerId = 'portal-container'

        // Pre-create container and share via globalThis
        const container = doc.createElement('div')
        container.id = containerId
        doc.body.appendChild(container)

        const ssrResult = renderToString(ssrComponent, { document: doc })
        console.log(`✅ [${name}] SSR body: ${doc.body.innerHTML}`)
        if (expectedFull !== (ssrResult)) {
            assert(false, `[${name}] SSR mismatch: got \n"${ssrResult}", expected \n${expectedFull}`)
        }

        return expected  // This is what the DOM test framework compares against
    }
}


export default () => <TestSnapshots Component={TestPortalMountObservable} />

// // Test with isolated document context and renderToString
// console.log('Testing with isolated document context...')
// const doc = createDocument()
// const containerId = 'portal-container'

// // Pre-create the container in the document BEFORE rendering
// let container = doc.createElement('div')
// container.id = containerId
// doc.body.appendChild(container)

//     // Set the container in globalThis so the component can use it
//     ; (globalThis as any).__portal_container = container

// // The component returns a function, so we need to invoke it properly
// const ComponentInstance = TestPortalMountObservable()
// const result: any = renderToString(ComponentInstance as any, {
//     document: doc,
//     returnDocument: true
// })

// console.log('HTML:', result.html)
// console.log('Document body innerHTML:', result.document.body.innerHTML)
// console.log('Container exists in body:', result.document.body.innerHTML.includes('portal-container'))

//     // Cleanup
//     ; (globalThis as any).__portal_container = undefined