import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestAttributeStatic = (): JSX.Element => {
    const ret: JSX.Element = () => (
        <>
            <h3>Attribute - Static</h3>
            <p data-color="red">content</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestAttributeStatic_ssr', ret)

    return ret
}

TestAttributeStatic.test = {
    static: true,
    expect: () => {
        const expected = '<p data-color="red">content</p>'

        const ssrComponent = testObservables['TestAttributeStatic_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = `<H3>Attribute - Static</H3>${expected}`
        if (ssrResult !== expectedFull) {
            assert(false, `[TestAttributeStatic] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestAttributeStatic] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestAttributeStatic} />