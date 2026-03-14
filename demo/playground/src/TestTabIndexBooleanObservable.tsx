import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const name = 'TestTabIndexBooleanObservable'
const TestTabIndexBooleanObservable = (): JSX.Element => {
    const ret: JSX.Element = () => (
        <>
            <h3>TabIndex - Boolean - Observable</h3>
            <p tabIndex={0}>content</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestTabIndexBooleanObservable_ssr', ret)

    return ret
}

TestTabIndexBooleanObservable.test = {
    static: true,
    expect: () => {
        const expected = '<p tabindex="0">content</p>'

        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<h3>TabIndex - Boolean - Observable</h3><p tabindex="0">content</p>'
        if (ssrResult !== expectedFull) {
            assert(false, `${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ ${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestTabIndexBooleanObservable} />