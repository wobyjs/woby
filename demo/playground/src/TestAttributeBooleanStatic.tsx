import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestAttributeBooleanStatic = (): JSX.Element => {
    const ret: JSX.Element = () => (
        <>
            <h3>Attribute Boolan - Static</h3>
            <p disabled={true}>content</p>
            <p disabled={false}>content</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestAttributeBooleanStatic_ssr', ret)

    return ret
}

TestAttributeBooleanStatic.test = {
    static: true,
    expect: () => {
        const expected = '<p disabled="">content</p><p>content</p>'

        const ssrComponent = testObservables['TestAttributeBooleanStatic_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = `<H3>Attribute Boolan - Static</H3><P disabled="">content</P><P>content</P>`
        if (ssrResult !== expectedFull) {
            assert(false, `[TestAttributeBooleanStatic] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestAttributeBooleanStatic] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestAttributeBooleanStatic} />