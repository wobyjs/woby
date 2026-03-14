import { $, $$, If, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const name = 'TestIfChildrenFunctionObservable'
const TestIfChildrenFunctionObservable = (): JSX.Element => {
    const o = $<number | false>(987654321)
    registerTestObservable('TestIfChildrenFunctionObservable', o)
    const toggle = () => o(prev => prev ? false : 1234567890)
    useInterval(toggle, TEST_INTERVAL)
    // toggle()
    const Content = ({ value }): JSX.Element => {
        return <p>Value: {value}</p>
    }
    const ret: JSX.Element = () => (
        <>
            <h3>If - Children Function Observable</h3>
            <If when={o}>
                {value => <Content value={value} />}
            </If>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}

TestIfChildrenFunctionObservable.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const val = $$(testObservables[name])

        // Define expected values for both main test and SSR test
        // const expectedFull = val !== false ? `<h3>If - Children Function Observable</h3><p>Value: ${val}</p>` : `<h3>If - Children Function Observable</h3><!---->`
        const expectedFull = `<h3>If - Children Function Observable</h3>` + (val !== false ? `<p>Value: ${val}</p>` : '')
        const expected = val !== false ? `<p>Value: ${val}</p>` : '<!---->'

        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        if (ssrResult !== expectedFull) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ ${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestIfChildrenFunctionObservable} />

// console.log(renderToString(<TestIfChildrenFunctionObservable />))