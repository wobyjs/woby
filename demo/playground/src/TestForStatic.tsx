import { $, $$, For, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestForStatic = (): JSX.Element => {
    const values = [1, 2, 3]
    const ret: JSX.Element = () => (
        <>
            <h3>For - Static</h3>
            <For values={values}>
                {(value: number) => {
                    return <p>Value: {value}</p>
                }}
            </For>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestForStatic_ssr', ret)

    return ret
}

TestForStatic.test = {
    static: true,
    expect: () => {
        const expected = '<p>Value: 1</p><p>Value: 2</p><p>Value: 3</p>'

        const ssrComponent = testObservables['TestForStatic_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<h3>For - Static</h3><p>Value: 1</p><p>Value: 2</p><p>Value: 3</p>'
        if (ssrResult !== expectedFull) {
            assert(false, `[TestForStatic] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [TestForStatic] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestForStatic} />