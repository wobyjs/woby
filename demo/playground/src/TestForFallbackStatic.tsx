import { $, $$, For, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const name = 'TestForFallbackStatic'
const TestForFallbackStatic = (): JSX.Element => {
    const ret: JSX.Element = () => (
        <>
            <h3>For - Fallback Static</h3>
            <For values={[]} fallback={<div>Fallback!</div>}>
                {(value: number) => {
                    return <p>Value: {value}</p>
                }}
            </For>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}

TestForFallbackStatic.test = {
    static: true,
    expect: () => {
        const expected = '<div>Fallback!</div>'

        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<h3>For - Fallback Static</h3><div>Fallback!</div>'
        if (ssrResult !== expectedFull) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ ${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestForFallbackStatic} />