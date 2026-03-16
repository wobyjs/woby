import { $, $$, For, Observable, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const name = 'TestForObservablesStatic'
const TestForObservablesStatic = (): JSX.Element => {
    const v1 = $(1)
    const v2 = $(2)
    const v3 = $(3)
    const values = [v1, v2, v3]
    useInterval(() => {
        v1((v1() + 1) % 5)
        v2((v2() + 1) % 5)
        v3((v3() + 1) % 5)
    }, TEST_INTERVAL)
    const ret: JSX.Element = () => (
        <>
            <h3>For - Observables Static</h3>
            <For values={values}>
                {(value: Observable<number>) => {
                    value()
                    return <p>Value: {value()}</p>
                }}
            </For>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}

TestForObservablesStatic.test = {
    static: true,
    compareActualValues: true,
    expect: () => {
        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        // Extract values from SSR result
        const matches = ssrResult.match(/<p>Value: (\d)<\/p>/g)
        const values = matches ? matches.map(match => match.match(/\d/)[0]) : ['1', '2', '3']
        const expected = `<p>Value: ${values[0]}</p><p>Value: ${values[1]}</p><p>Value: ${values[2]}</p>`

        const expectedFull = `<h3>For - Observables Static</h3>${expected}`
        if (ssrResult !== expectedFull) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestForObservablesStatic} />