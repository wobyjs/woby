import { $, $$, Portal, renderToString, createDocument, type JSX, useTimeout } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const name = 'TestPortalObservable'
const TestPortalObservable = (): JSX.Element => {
    const AB = (): JSX.Element => {
        const a = <i>a</i>
        const b = <u>b</u>
        const component = $(a)
        const toggle = () => component(() => (component() === a) ? b : a)
        useInterval(toggle, TEST_INTERVAL / 2)
        return component
    }

    const CD = (): JSX.Element => {
        const c = <b>c</b>
        const d = <span>d</span>
        const component = $(c)
        const toggle = () => component(() => (component() === c) ? d : c)
        useInterval(toggle, TEST_INTERVAL / 2)
        return component
    }
    const ab = <AB />
    const cd = <CD />
    const component = $(ab)
    const toggle = () => component(() => (component() === ab) ? cd : ab)
    useInterval(toggle, TEST_INTERVAL)
    const ret = (props?: { mount?: Element }) => (
        <>
            <h3>Portal - Observable</h3>
            <Portal mount={props?.mount ?? document.body}>
                {component} for TestPortalObservable "Portal - Observable"
            </Portal>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}

TestPortalObservable.test = {
    static: true,
    expect: () => {
        // Define expected values for both main test and SSR test
        const expectedFull = '<h3>Portal - Observable</h3><div id="portal-container-observable"></div><i>a</i> for TestPortalObservable "Portal - Observable"'  // For SSR comparison (portal renders as comment)
        const expected = '<!---->'   // For main DOM test comparison

        // SSR test - create isolated document context and shared container
        const SsrComponent = testObservables[`${name}_ssr`] as any
        const doc = createDocument()
        const container = doc.createElement('div')
        container.id = 'portal-container-observable'
        doc.body.appendChild(container)

        const ssrResult = renderToString(<SsrComponent mount={doc.body} />, { document: doc })
        // const ssrResult = renderToString((SsrComponent as any)({ mount: container }), { document: doc })
        console.log(`✅ [${name}] SSR body: ${doc.body.innerHTML}`)
        if (ssrResult !== expectedFull) {
            assert(false, `[${name}] SSR mismatch: got \n"${ssrResult}", expected \n"${expectedFull}"`)
        }

        return expected  // This is what the DOM test framework compares against
    }
}


export default () => <TestSnapshots Component={TestPortalObservable} />

// const doc = createDocument()
// const container = doc.createElement('div')
// container.id = 'portal-container-observable'
// doc.body.appendChild(container)
// const Tpo = TestPortalObservable()
// console.log(renderToString(<Tpo mount={doc.body} />, { document: doc }))

// useTimeout(() => {
//     console.log(renderToString(<Tpo mount={doc.body} />, { document: doc }))
// }, 1000)


// useTimeout(() => {
//     console.log(renderToString(<Tpo mount={doc.body} />, { document: doc }))
// }, 1000)

