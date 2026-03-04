import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestBigIntStatic = (): JSX.Element => {
    const ret: JSX.Element = () => (
        <>
            <h3>BigInt - Static</h3>
            <p>{123123n}</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestBigIntStatic_ssr', ret)

    return ret
}

TestBigIntStatic.test = {
    static: true,
    expect: () => {
        const expected = '<p>123123n</p>'

        const ssrComponent = testObservables['TestBigIntStatic_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = `<h3>BigInt - Static</h3>${expected}`
        if (ssrResult !== expectedFull) {
            assert(false, `[TestBigIntStatic] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestBigIntStatic] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestBigIntStatic} />