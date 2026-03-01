import { $, $$, For, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, random, assert } from './util'

const TestForRandom = (): JSX.Element => {
    const values = $([random(), random(), random()])
    // Store the observable globally so the test can access it
    registerTestObservable('TestForRandom', values)
    const update = () => values([random(), random(), random()])
    useInterval(update, TEST_INTERVAL)
    const ret: JSX.Element = () => (
        <>
            <h3>For - Random Only Child</h3>
            <For values={values}>
                {(value: number) => {
                    return <p>Value: {value}</p>
                }}
            </For>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestForRandom_ssr', ret)

    return ret
}

TestForRandom.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const values = $$(testObservables['TestForRandom'])
        const expected = `<p>Value: ${values[0]}</p><p>Value: ${values[1]}</p><p>Value: ${values[2]}</p>`

        const ssrComponent = testObservables['TestForRandom_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = `<h3>For - Random Only Child</h3>${expected}`
        if (ssrResult !== expectedFull) {
            assert(false, `[TestForRandom] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestForRandom] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestForRandom} />