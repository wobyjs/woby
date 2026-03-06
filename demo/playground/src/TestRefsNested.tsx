import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestRefsNested = (): JSX.Element => {
    const ref1 = $<HTMLElement>()
    const ref2 = $<HTMLElement>()
    useEffect(() => {
        const element1 = ref1()
        const element2 = ref2()
        if (!element1) return
        if (!element2) return
        const content1 = `Got ref1 - Has parent: ${!!element1.parentElement} - Is connected: ${!!element1.isConnected}`
        const content2 = `Got ref2 - Has parent: ${!!element2.parentElement} - Is connected: ${!!element2.isConnected}`
        element1.textContent = `${content1} / ${content2}`
    }, { sync: true })
    const ret: JSX.Element = () => (
        <>
            <h3>Refs - Nested</h3>
            <p ref={[ref1, [null, [undefined, ref2]]]}>content</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestRefsNested_ssr', ret)

    return ret
}

TestRefsNested.test = {
    static: true,
    expect: () => {
        // SSR doesn't execute useEffect, so just shows 'content'
        // DOM executes useEffect with sync:true, so shows ref status
        const expectedForSSR = '<p>content</p>'
        const expectedForDOM = '<p>Got ref1 - Has parent: true - Is connected: true / Got ref2 - Has parent: true - Is connected: true</p>'

        const ssrComponent = testObservables['TestRefsNested_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<h3>Refs - Nested</h3>' + expectedForSSR
        if (ssrResult !== expectedFull) {
            assert(false, `[TestRefsNested] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestRefsNested] SSR test passed: ${ssrResult}`)
        }

        return expectedForDOM
    }
}


export default () => <TestSnapshots Component={TestRefsNested} />