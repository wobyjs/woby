import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, random, assert } from './util'

const TestComponentStaticRenderProps = ({ value }: { value: number }): JSX.Element => {
    const propValue = random()
    registerTestObservable('TestComponentStaticRenderProps', propValue)
    const ret: JSX.Element = () => (
        <>
            <h3>Component - Static Render Props</h3>
            <p>{propValue}</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestComponentStaticRenderProps_ssr', ret)

    return ret
}

TestComponentStaticRenderProps.test = {
    static: true,
    compareActualValues: true,
    expect: () => {
        const propValue = testObservables['TestComponentStaticRenderProps']

        // Define expected values for both main test and SSR test
        const expectedFull = `<h3>Component - Static Render Props</h3><p>${String(propValue)}</p>`  // For SSR comparison
        const expected = `<p>${String(propValue)}</p>`   // For main test comparison

        const ssrComponent = testObservables['TestComponentStaticRenderProps_ssr']
        const ssrResult = renderToString(ssrComponent)
        if (ssrResult !== expectedFull) {
            assert(false, `[TestComponentStaticRenderProps] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestComponentStaticRenderProps] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestComponentStaticRenderProps} />