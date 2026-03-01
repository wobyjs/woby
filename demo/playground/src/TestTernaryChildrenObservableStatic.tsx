import { $, $$, Ternary, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, random, assert } from './util'

const TestTernaryChildrenObservableStatic = (): JSX.Element => {
    const trueValue = $(String(random()))
    const falseValue = $(String(random()))
    registerTestObservable('TestTernaryChildrenObservableStatic_true', trueValue)
    registerTestObservable('TestTernaryChildrenObservableStatic_false', falseValue)
    const True = () => {
        const o = $(String(random()))
        const randomize = () => o(String(random()))
        useInterval(randomize, TEST_INTERVAL)
        o()
        return <p>True: {trueValue}</p>
    }
    const False = () => {
        const o = $(String(random()))
        const randomize = () => o(String(random()))
        useInterval(randomize, TEST_INTERVAL)
        o()
        return <p>False: {falseValue}</p>
    }
    const ret: JSX.Element = () => (
        <>
            <h3>Ternary - Children Observable Static</h3>
            <Ternary when={true}>
                <True />
                <False />
            </Ternary>
            <Ternary when={false}>
                <True />
                <False />
            </Ternary>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestTernaryChildrenObservableStatic_ssr', ret)

    return ret
}

TestTernaryChildrenObservableStatic.test = {
    static: true,
    compareActualValues: true,
    expect: () => {
        const trueValue = $$(testObservables['TestTernaryChildrenObservableStatic_true'])
        const falseValue = $$(testObservables['TestTernaryChildrenObservableStatic_false'])
        const expected = `<p>True: ${trueValue}</p><p>False: ${falseValue}</p>`

        const ssrComponent = testObservables['TestTernaryChildrenObservableStatic_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = `<h3>Ternary - Children Observable Static</h3><p>True: ${trueValue}</p><p>False: ${falseValue}</p>`
        if (ssrResult !== expectedFull) {
            assert(false, `[TestTernaryChildrenObservableStatic] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestTernaryChildrenObservableStatic] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestTernaryChildrenObservableStatic} />