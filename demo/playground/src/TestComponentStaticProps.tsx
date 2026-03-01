import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, random, assert } from './util'

const TestComponentStaticProps = ({ value }: { value: number }): JSX.Element => {
    registerTestObservable('TestComponentStaticProps', $(value))
    const ret: JSX.Element = () => (
        <>
            <h3>Component - Static Props</h3>
            <p>{value}</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestComponentStaticProps_ssr', ret)

    return ret
}

TestComponentStaticProps.test = {
    static: true,
    compareActualValues: true,
    expect: () => {
        const propValue = $$(testObservables['TestComponentStaticProps'])

        // Define expected values for both main test and SSR test
        const expectedFull = `<h3>Component - Static Props</h3><p>${propValue}</p>`  // For SSR comparison
        const expected = `<p>${propValue}</p>`   // For main test comparison

        const ssrComponent = testObservables['TestComponentStaticProps_ssr']
        const ssrResult = renderToString(ssrComponent)
        if (ssrResult !== expectedFull) {
            assert(false, `[TestComponentStaticProps] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestComponentStaticProps] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestComponentStaticProps} props={{ value: random() }} />