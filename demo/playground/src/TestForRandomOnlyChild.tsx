import { $, $$, For, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, random, assert } from './util'

const TestForRandomOnlyChild = (): JSX.Element => {
    const values = $([random(), random(), random()])
    // Store the observable globally so the test can access it
    registerTestObservable('TestForRandomOnlyChild', values)
    const update = () => values([random(), random(), random()])
    useInterval(update, TEST_INTERVAL)
    const ret: JSX.Element = (
        <>
            <h3>For - Random</h3>
            <For values={values}>
                {(value: number) => {
                    return <p>{value}</p>
                }}
            </For>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestForRandomOnlyChild_ssr', ret)

    return ret
}

TestForRandomOnlyChild.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const values = $$(testObservables['TestForRandomOnlyChild'])
        const expected = `<p>${values[0]}</p><p>${values[1]}</p><p>${values[2]}</p>`

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestForRandomOnlyChild_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    const expectedFull = `<h3>For - Random</h3>${expected}`
                    if (ssrResult !== expectedFull) {
                        assert(false, `[TestForRandomOnlyChild] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
                    } else {
                        console.log(`✅ [TestForRandomOnlyChild] SSR test passed: ${ssrResult}`)
                    }
                }).catch(err => {
                    console.error(`[TestForRandomOnlyChild] SSR render error: ${err}`)
                })
            }
        }, 0)

        return expected
    }
}


export default () => <TestSnapshots Component={TestForRandomOnlyChild} />