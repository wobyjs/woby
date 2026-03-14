import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const name = 'TestAttributeStatic'
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

        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = `<h3>Attribute - Static</h3>${expected}`
        if (ssrResult !== expectedFull) {
            assert(false, `${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ ${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestAttributeStatic} />