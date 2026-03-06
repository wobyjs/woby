import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestRefUntrack = (): JSX.Element => {
    const o = $(0)
    const increment = () => o(prev => prev + 1)
    useInterval(increment, TEST_INTERVAL)

    const Reffed = hmr(() => { }, (): JSX.Element => {
        const ref = element => element.textContent = o()
        return <p ref={ref}>content</p>
    })

    const ret: JSX.Element = () => (
        <>
            <h3>Ref - Untrack</h3>
            <Reffed />
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestRefUntrack_ssr', ret)

    return ret
}

TestRefUntrack.test = {
    static: true,
    expect: () => {
        // SSR renders initial state before interval updates
        const expectedForSSR = '<p>content</p>'
        // DOM shows dynamic value from observable (0 initially)
        const expectedForDOM = '<p>0</p>'

        const ssrComponent = testObservables['TestRefUntrack_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<h3>Ref - Untrack</h3>' + expectedForSSR
        if (ssrResult !== expectedFull) {
            assert(false, `[TestRefUntrack] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestRefUntrack] SSR test passed: ${ssrResult}`)
        }

        return expectedForDOM
    }
}


export default () => <TestSnapshots Component={TestRefUntrack} />