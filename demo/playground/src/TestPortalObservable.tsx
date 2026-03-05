import { $, $$, Portal, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

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
    const ret: JSX.Element = () => (
        <>
            <h3>Portal - Observable</h3>
            <Portal mount={document.body}>
                {component}
            </Portal>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestPortalObservable_ssr', ret)

    return ret
}

TestPortalObservable.test = {
    static: true,
    expect: () => {
        // Define expected values for both main test and SSR test
        const expectedFull = '<h3>Portal - Observable</h3><!---->'  // For SSR comparison (portal renders as comment)
        const expected = '<!---->'   // For main DOM test comparison

        const ssrComponent = testObservables['TestPortalObservable_ssr']
        const ssrResult = renderToString(ssrComponent)
        if (ssrResult !== expectedFull) {
            assert(false, `[TestPortalObservable] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestPortalObservable] SSR test passed: ${ssrResult}`)
        }

        return expected  // This is what the DOM test framework compares against
    }
}


export default () => <TestSnapshots Component={TestPortalObservable} />